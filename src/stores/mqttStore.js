import { defineStore } from "pinia";
import { ref } from "vue";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { getDatabase, push, ref as dbRef } from "firebase/database";
import { firebaseApp } from "@/config/firebase";
import mqtt from "mqtt";

// inicia o Firebase
const rtdb = getDatabase(firebaseApp);
const db = getFirestore();

export const useMqttStore = defineStore("mqtt", () => {
  const client = ref(null);
  const isConnected = ref(false);
  const connecting = ref(false);
  const logs = ref([]);
  const messages = ref([]);
  const newMessage = ref("");

  // Lista de Brokers públicos
  const brokers = ref([
    {
      name: "Mosquitto WebSocket (8080)",
      url: "ws://test.mosquitto.org:8080",
    },
    {
      name: "Mosquitto WebSocket Secure (8081)",
      url: "wss://test.mosquitto.org:8081/mqtt",
    },
    {
      name: "HiveMQ Public",
      url: "wss://broker.hivemq.com:8884/mqtt",
    },
    {
      name: "EMQX Public",
      url: "wss://broker.emqx.io:8084/mqtt",
    },
  ]);

  const selectedBroker = ref(brokers.value[1]);

  // Lista de tópicos disponíveis
  const availableTopics = ref([
    "ifrs/sala/001",
    "ifrs/sala/002",
    "ifrs/sala/POAlab",
    "ifrs/sala/RobotIF",
    "ifrs/sala/1003",
    "ifrs/sala/1004",
  ]);

  // Tópico selecionado
  const topic = ref(availableTopics.value[0]);
  // Log de eventos
  const addLog = (msg) => {
    logs.value.unshift(`[${new Date().toLocaleTimeString()}] ${msg}`);
    if (logs.value.length > 30) logs.value.pop();
  };

  window.global = window;

  // Conectar ao broker MQTT
  const connect = () => {
    if (client.value || connecting.value) return;
    connecting.value = true;
    addLog(`Tentando conectar em: ${selectedBroker.value.url}`);

    try {
      client.value = mqtt.connect(selectedBroker.value.url, {
        clientId: "vue_client_" + Math.random().toString(16).substr(2, 8),
        keepalive: 60,
        clean: true,
        reconnectPeriod: 4000,
        connectTimeout: 8000,
      });
      // Conectado com sucesso
      client.value.on("connect", () => {
        isConnected.value = true;
        connecting.value = false;
        addLog("✅ Conectado!");

        // Escuta todos os ambientes
        client.value.subscribe("ifrs/sala/#", (err) => {
          if (!err) addLog("📡 Escutando todas as salas (ifrs/sala/#)");
        });
      });

      // Recebe mensagens
      client.value.on("message", async (topicName, payload) => {
        if (topicName.endsWith("/resposta")) return; // Ignora mensagens de resposta

        const msg = payload.toString();
        const newMsg = {
          topic: topicName,
          message: msg,
          timestamp: new Date().toLocaleTimeString(),
        };
        messages.value.unshift(newMsg);
        addLog(`📥 Mensagem recebida: ${topicName}`);

        // 🔍 Verifica se é um tópico de sala e valida a tag
        const match = topicName.match(/^ifrs\/sala\/([^/]+)$/);
        if (!match) return;
        const ambiente = match[1];
        await validarTagComFirestore(msg, ambiente);
      });

      // Erros de conexão
      client.value.on("error", (err) => {
        addLog(`❌ Erro: ${err.message}`);
        connecting.value = false;
      });

      // Conexão encerrada
      client.value.on("close", () => {
        isConnected.value = false;
        connecting.value = false;
        addLog("🔌 Conexão encerrada");
      });
    } catch (err) {
      connecting.value = false;
      addLog(`❌ Erro na conexão: ${err.message}`);
    }
  };

  // 🔊 inscreve-se no tópico
  function subscribe(t) {
    if (client.value && isConnected.value) {
      client.value.subscribe(t, (err) => {
        if (err) console.error("Erro ao se inscrever:", err);
        else addLog(`📡 Inscrito em: ${t}`);
      });
    }
  }

  // Publicar mensagem
  const publish = (message, topicName = topic.value) => {
    if (client.value && isConnected.value) {
      client.value.publish(topicName, message);
      addLog(`📤 Publicado em ${topicName}: ${message}`);
    }
  };

  // 🧾 valida tag com o Firestore
  async function validarTagComFirestore(tag, ambiente) {
    try {
      console.log(`🔍 Verificando tag ${tag} para ambiente ${ambiente}...`);

      const q = query(
        collection(db, "usuarios"),
        where("tag", "==", tag),
        where("ambiente", "==", ambiente)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0].data();
        console.log(`✅ Acesso autorizado: ${user.nome} ${user.sobrenome}`);

        // 🔔 registra no Realtime Database (log)
        await push(dbRef(rtdb, "logs"), {
          tag,
          ambiente,
          usuario: `${user.nome} ${user.sobrenome}`,
          dataHora: Date.now(),
          status: "autorizado",
        });

        // 🔁 envia resposta MQTT para o ESP32 (por exemplo, "1")
        publish("1", `ifrs/sala/${ambiente}/resposta`);
      } else {
        console.warn("🚫 Tag não autorizada!");

        await push(dbRef(rtdb, "logs"), {
          tag,
          ambiente,
          usuario: "desconhecido",
          dataHora: Date.now(),
          status: "negado",
        });

        // envia "0" para indicar acesso negado
        publish("0", `ifrs/sala/${ambiente}/resposta`);
      }
    } catch (error) {
      console.error("Erro ao validar tag:", error);
    }
  }
  // trocar de Broker
  const changeBroker = (newBroker) => {
    selectedBroker.value = newBroker;
    addLog(`Broker alterado para: ${newBroker.name}`);
    if (isConnected.value) disconnect();
  };

  // 🔌 desconecta
  const disconnect = () => {
    if (client.value) {
      client.value.end();
      client.value = null;
      isConnected.value = false;
      addLog("🔌 Desconectado manualmente");
    }
  };

  return {
    client,
    isConnected,
    connecting,
    brokers,
    selectedBroker,
    topic,
    availableTopics,
    messages,
    newMessage,
    logs,
    connect,
    disconnect,
    subscribe,
    publish,
    changeBroker,
  };
});
