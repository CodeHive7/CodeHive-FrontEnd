import "../../utils/polyfills.js";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import apiClient from "../apiClient.js";

let stompClient = null;
const subscribers = new Map();

export const fetchAllProjects = async () => {
    const response = await apiClient.get("/project/accepted");
    return response.data;
};

export const fetchCategories = async () => {
    const response = await apiClient.get("/admin/categories");
    return response.data;
}

export const applyForPosition = async (projectId, positionId, answers = {}) => {
    await apiClient.post(`/project/${projectId}/positions/${positionId}/apply`, answers);
};

export const createProject = async (projectData) => {
    await apiClient.post("/project", projectData);
};

export const fetchProjectById = async (projectId) => {
    const response = await apiClient.get(`/project/${projectId}`);
    return response.data;
};

export const getUserProfile = async () => {
    try {
        const response = await apiClient.get("/user/profile");
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile", error);
        throw error;
    }
};

export const getUserProfileByUsername = async (username) => {
    try {
        const response = await apiClient.get(`/user/profile/${username}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile", error);
        throw error;
    }
};

export const updateUserProfile = async (updatedUserProfile) => {
    try {
        const response = await apiClient.put("/user/profile", updatedUserProfile);
        return response.data;
    } catch (error) {
        console.error("Error updating user profile", error);
        throw error;
    }
};

export const fetchMyProjects = async () => {
    try {
        const response = await apiClient.get("/project/my-projects");
        return response.data;
    } catch (error) {
        console.error("Error fetching my projects", error);
        throw error;
    }
};

export const fetchAppliedProjects = async () => {
    try {
        const response = await apiClient.get("/project/applied-projects");
        return response.data;
    } catch (error) {
        console.error("Error fetching applied projects", error);
        throw error;
    }
};

export const fetchApplicantsForProjects = async () => {
    try {
        const response = await apiClient.get("/project/my-applicants");
        return response.data;
    } catch (error) {
        console.error("Error fetching applicants", error);
        throw error;
    }
};

export const updateApplicationStatus = async (projectId, applicationIds, accept, feedback= "") => {
    try {
        const response = await apiClient.put(`/project/${projectId}/applications`, {
            applicationIds,
            accept,
            feedback
        });
        return response.data;
    } catch (error) {
        console.error("Error updating application status", error);
        throw error;
    }
};

export const fetchProjectTasks = async (projectId) => {
    try {
        const response = await apiClient.get(`/tasks/${projectId}/tasks`);
        return response.data;
    } catch (error) {
        console.error("Error fetching project tasks", error);
        throw error;
    }
};

export const fetchAssignedTasks = async () => {
    try {
        const response = await apiClient.get("/tasks/my-tasks");
        return response.data;
    } catch (error) {
        console.error("Error fetching tasks", error);
        throw error;
    }
};

export  const createTask = async (projectId, taskData) => {
    try {
        const response = await apiClient.post(`/tasks/${projectId}/tasks`, taskData);
        return response.data;
    } catch (error) {
        console.error("Error creating task", error);
        throw error;
    }
};

export const updateTaskStatus = async (taskId, status) => {
    try {
        const response = await apiClient.put(`/tasks/${taskId}/status`, {status});
        return response.data;
    } catch (error) {
        console.error("Error updating task", error);
        throw error;
    }
};

export const fetchAcceptedApplicants = async (projectId) => {
    try {
        const response = await apiClient.get(`/project/${projectId}/accepted-applicants`);
        return response.data;
    } catch (error) {
        console.error("Error fetching accepted applicants", error);
        throw error;
    }
};


export const connectToChat = (token, onConnected , onError) => {
    if (stompClient) {
        if (stompClient.connected) return stompClient;
        stompClient.deactivate();
    }

    const socket = new SockJS('http://localhost:8082/ws-chat');

    socket.onopen = () => {
        console.log("WebSocket Opened");
    };

    socket.onclose = () => {
        console.log("WebSocket Closed");
    };

    socket.onerror = (error) => {
        console.error("WebSocket Error:", error);
    };
    stompClient = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
            Authorization: `Bearer ${token}`
        },
        debug: (str) => {
            if (process.env.NODE_ENV === "development") {
                console.log(`STOMP: ${str}`);
            }
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
    });

    stompClient.onConnect = () => {
        console.log("WebSocket Connected");
        if (onConnected) onConnected(stompClient);
    };

    stompClient.onDisconnect = () => {
        console.log("WebSocket Disconnected");
    };

    stompClient.onStompError = (frame) => {
        console.error("STOMP Error:", frame);
        if (onError) onError(frame);
    };

    stompClient.activate();
    return stompClient;
};

export const disconnectFromChat = () => {
    if (stompClient && stompClient.connected) {
        stompClient.deactivate();
        console.log("WebSocket Disconnected");
    }
};

export const subscribeToProject = (projectId, OnMessageReceived) => {
    if (!stompClient || !stompClient.connected) {
        console.error("STOMP client not connected");
        return null;
    }

    const subscriptionKey = `/topic/project.${projectId}`;
    // If already subscribed , just add new callback
    if (subscribers.has(subscriptionKey)) {
        const callbacks = subscribers.get(subscriptionKey).callbacks;
        callbacks.push(OnMessageReceived);
        return subscribers.get(subscriptionKey).subscription;
    }

    console.log(`Subscribing to ${subscriptionKey}`);

    const subscription = stompClient.subscribe(subscriptionKey, (message) => {
        console.log("Received message on project subscription", message);
        try {
        const receivedMessage = JSON.parse(message.body);

        // Call all registered callbacks for this subscription
        const callbacks = subscribers.get(subscriptionKey).callbacks;
        callbacks.forEach(callback => callback(receivedMessage));
        } catch (error) {
            console.error("Error parsing project message", error);
        }
    });

    subscribers.set(subscriptionKey, {
        subscription: subscription,
        callbacks: [OnMessageReceived]
      });

    return subscription;
};

export const sendChatMessage = (projectId, content) => {
    if (!stompClient || !stompClient.connected) {
      throw new Error('WebSocket not connected');
    }
  
    stompClient.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({
        projectId: projectId,
        content: content
      })
    });
};

export const joinProjectChat = (projectId) => {
    if (!stompClient || !stompClient.connected) {
      throw new Error('WebSocket not connected');
    }

    try {
        console.log(`Sending join message for project ${projectId}`);
        stompClient.publish({
        destination: '/app/chat.join',
        body: JSON.stringify({
            projectId: projectId,
            content: ""
        })
        });
} catch (error) {
    console.error("Error joining project chat", error);
}
};

// Subscribe to user-specific messages (like history)
export const subscribeToUserMessages = (onHistoryReceived) => {
    if (!stompClient || !stompClient.connected) {
      console.error('STOMP client not connected');
      return null;
    }
  
    return stompClient.subscribe('/user/queue.messages', (message) => {
        console.log("Received messages", message);
        try {
            const messages = message.body ? JSON.parse(message.body) : [];
            onHistoryReceived(messages);
        } catch (error) {
            console.error("Error parsing message history", error);
            onHistoryReceived([]);
        }
    });
};

// Request message history
export const fetchChatHistory = (projectId) => {
    if (!stompClient || !stompClient.connected) {
      throw new Error('WebSocket not connected');
    }
  
    stompClient.publish({
      destination: '/app/chat.fetchMessages',
      body: JSON.stringify({
        projectId: projectId,
        content: ""
      })
    });
};

export const getProjectMessages = async (projectId) => {
    try {
        const response = await apiClient.get(`/chat/${projectId}/messages`);
        return response.data;
    } catch (error) {
        console.error("Error fetching project messages", error);
        throw error;
    }
};

export const sendProjectMessage = async (projectId, content) => {
    try {
        const response = await apiClient.post(`/chat/${projectId}/messages`, {content});
        return response.data;
    } catch (error) {
        console.error("Error sending message", error);
        throw error;
    }
};