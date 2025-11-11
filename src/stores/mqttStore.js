import { defineStore } from "pinia";
import { ref } from "vue";
import mqtt from "mqtt";

export const useMqttStore = defineStore("mqtt", () => {
  const client = ref(null);
  const isConnected = ref(false);
  const connecting = ref(false);
  const logs = ref([]);
  const messages = ref([]);
  //const topic = ref("ifrs/sala/001");

  // Lista de Brokers públicos
  const brokers = ref([
    {
      name: "Mosquitto WebSocket (8080)",
      url: "ws://test.mosquitto.org:8080",
    },
    {
      name: "Mosquitto WebSocket Secure (8081)",
      url: "wss://test.mosquitto.org:8081",
    },
    {
      name: "HiveMQ Public",
      url: "wss://broker.hivemq.com:8884",
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

  const addLog = (msg) => {
    logs.value.unshift(`[${new Date().toLocaleTimeString()}] ${msg}`);
    if (logs.value.length > 30) logs.value.pop();
  };

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

      client.value.on("connect", () => {
        isConnected.value = true;
        connecting.value = false;
        addLog("✅ Conectado!");
        //client.value.subscribe("ifrs/sala/#");

        // Escuta todas as salas
        client.value.subscribe("ifrs/sala/#", (err) => {
          if (!err) addLog("📡 Escutando todas as salas (ifrs/sala/#)");
        });
      });

      client.value.on("message", (topicName, payload) => {
        const newMsg = {
          topic: topicName,
          message: payload.toString(),
          timestamp: new Date().toLocaleTimeString(),
        };
        messages.value.unshift(newMsg);
        addLog(`📥 Mensagem recebida: ${topicName}`);
      });

      client.value.on("error", (err) => {
        addLog(`❌ Erro: ${err.message}`);
        connecting.value = false;
      });

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

  const disconnect = () => {
    if (client.value) {
      client.value.end();
      client.value = null;
      isConnected.value = false;
      addLog("🔌 Desconectado manualmente");
    }
  };

  const publish = (msg, topicName = topic.value) => {
    if (client.value && isConnected.value) {
      client.value.publish(topicName, msg);
      addLog(`📤 Publicado em ${topicName}: ${msg}`);
    }
  };

  const changeBroker = (newBroker) => {
    selectedBroker.value = newBroker;
    addLog(`Broker alterado para: ${newBroker.name}`);
    if (isConnected.value) disconnect();
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
    logs,
    connect,
    disconnect,
    publish,
    changeBroker,
  };
});
