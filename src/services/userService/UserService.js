import "../../utils/polyfills.js";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import apiClient from "../apiClient.js";
import { startOfDay } from "date-fns";
import { tr } from "date-fns/locale";

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

export const deleteProject = async (projectId) => {
    try {
        const response = await apiClient.delete(`/project/${projectId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting project", error);
        throw error;
    }
};

export const updateProject = async (projectId, projectData) => {
    try {
        const response = await apiClient.put(`/project/${projectId}`, projectData);
        return response.data;
    } catch (error) {
        console.error("Error updating project", error);
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

export const connectToChat = (token, onConnected, onError) => {
    // Force disconnect any existing client
    if (stompClient) {
        try {
            stompClient.deactivate();
        } catch (error) {
            console.warn("Error deactivating existing client", error);
        }
        stompClient = null;
    }
    
    console.log("Creating new STOMP connection");
    const socket = new SockJS(`http://localhost:8082/ws-chat?token=${token}`);
    //const socket = new SockJS(`http://localhost:8083/ws-chat`); // dockerised version

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

    socket.onopen = () => console.log("WebSocket Opened");
    socket.onclose = () => console.log("WebSocket Closed");
    socket.onerror = (error) => console.error("WebSocket Error:", error);

    stompClient.onConnect = () => {
        console.log("WebSocket Connected");
        if (onConnected) onConnected(stompClient);
    };

    stompClient.onStompError = (frame) => {
        console.error("STOMP Error:", frame);
        if (onError) onError(frame);
    };

    stompClient.activate();
    return stompClient;
};

export const disconnectFromChat = () => {
    if (stompClient) {
        try {
            if (stompClient.connected) {
                stompClient.deactivate();
                console.log("WebSocket Disconnected");
            }
            stompClient = null;
        } catch (error) {
            console.warn("Error during disconnect:", error);
            stompClient = null;
        }
    }
};

export const subscribeToProject = (projectId, OnMessageReceived) => {
    if (!stompClient || !stompClient.connected) {
        console.error("STOMP client not connected");
        return null;
    }

    const subscriptionKey = `/topic/project/${projectId}`;
    console.log(`Subscribing to ${subscriptionKey}`);

    try {
        const subscription = stompClient.subscribe(subscriptionKey, (message) => {
            console.log("Received message on project subscription:", message.body);
            try {
                const parsedMessage = JSON.parse(message.body);
                console.log("Parsed message:", parsedMessage);
                OnMessageReceived(parsedMessage);
            } catch (error) {
                console.error("Error parsing message", error, message.body);
            }
        });

        console.log("Project subscription successful");
        return subscription;
    } catch (error) {
        console.error(`Error subscribing to ${subscriptionKey}`, error);
        return null;
    }
};

export const sendChatMessage = (projectId, content) => {
    if (!stompClient || !stompClient.connected) {
      throw new Error('WebSocket not connected');
    }
  
    stompClient.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({
        projectId,
        content
      })
    });
};

export const joinProjectChat = (projectId) => {
    if (!stompClient || !stompClient.connected) {
        console.error("STOMP client not connected");
        return false;
    }

    try {
        console.log(`Sending join message for project ${projectId}`);
        stompClient.publish({
            destination: '/app/chat.join',
            body: JSON.stringify({
                projectId: Number(projectId),
                content: ""
            })
        });
        return true;
    } catch (error) {
        console.error("Error joining project chat", error);
        return false;
    }
};

// Subscribe to user-specific messages (like history)
export const subscribeToUserMessages = (OnUserMessagesReceived) => {
    if (!stompClient || !stompClient.connected) {
        console.error("STOMP client not connected");
        return null;
    }

    try {
        const subscription = stompClient.subscribe('/user/queue/messages', (message) => {
            console.log("Received message history:", message.body);
            try {
                const parsedMessages = JSON.parse(message.body);
                console.log("History messages count:", 
                    Array.isArray(parsedMessages) ? parsedMessages.length : "not an array");
                
                    if (Array.isArray(parsedMessages)) {
                        OnUserMessagesReceived(parsedMessages);
                    } else {
                        console.warn("History is not an array, using empty array instead");
                        OnUserMessagesReceived([]);
                    }
            } catch (error) {
                console.error("Error parsing message history", error, message.body);
                // Important: Return empty array to prevent loading state from getting stuck
                OnUserMessagesReceived([]);
            }
        });
        
        console.log("User subscription successful");
        return subscription;
    } catch (error) {
        console.error("Error subscribing to user messages", error);
        return null;
    }
};

// Replace the fetchChatHistory function:

export const fetchChatHistory = (projectId) => {
    console.log(`Requesting chat history for project ${projectId}`);
    
    if (!stompClient || !stompClient.connected) {
        console.error("STOMP client not connected when fetching history");
        return false;
    }

    try {
        stompClient.publish({
            destination: '/app/chat.fetchMessages',
            body: JSON.stringify({
                projectId: projectId,
                content: ""
            })
        });
        console.log("Chat history request sent");
        
        // Set a fallback timeout to fetch via HTTP if WebSocket history fails
        setTimeout(() => {
            getProjectMessages(projectId)
                .then(messages => {
                    if (messages && messages.length > 0) {
                        console.log(`Fallback: Got ${messages.length} messages via HTTP`);
                        const event = new CustomEvent('chat-history', {
                            detail: { messages, projectId }
                        });
                        window.dispatchEvent(event);
                    }
                })
                .catch(err => console.error("Fallback history fetch failed:", err));
            }, 5000);
            return true;
    } catch (error) {
        console.error("Error fetching chat history", error);
        return false;
    }
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
        const response = await apiClient.post(`/chat/${projectId}/messages`, { content });
        return response.data;
    } catch (error) {
        console.error("Error sending message", error);
        throw error;
    }
};

// Skills Api
export const getAllSkills = async () => {
    try {
        const response = await apiClient.get("/skills");
        return response.data;
    } catch (error) {
        console.error("Error fetching skills", error);
        throw error;
    }
};

export const getUserSkills = async () => {
    try {
        const response = await apiClient.get("/skills/user");
        return response.data;
    } catch (error) {
        console.error("Error fetching user skills", error);
        throw error;
    }
};

export const addSkillToUser = async (skillName) => {
    try {
        const response = await apiClient.post("/skills/user", { name: skillName });
        return response.data;
    } catch (error) {
        console.error("Error adding skill", error);
        throw error;
    }
};

export const removeSkillFromUser = async (skillId) => {
    try {
        await apiClient.delete(`/skills/user/${skillId}`);
    } catch (error) {
        console.error("Error removing skill", error);
        throw error;
    }
}

// Experience API
export const getUserExperiences = async () => {
    try {
        const response = await apiClient.get("/experiences");
        return response.data;
    } catch (error) {
        console.error("Error fetching user experiences", error);
        throw error;
    }
};

export const createExperience = async (experienceData) => {
  try {
    // Remove client-side only fields
    const { tempId, ...dataToSend } = experienceData;
    
    // Format dates for the API
    const formattedData = {
      ...dataToSend,
      startDate: dataToSend.startDate ? dataToSend.startDate.split('T')[0] : null,
      endDate: dataToSend.endDate ? dataToSend.endDate.split('T')[0] : null
    };
    
    console.log("Creating experience with data:", formattedData);
    const response = await apiClient.post("/experiences", formattedData);
    return response.data;
  } catch (error) {
    console.error("Error creating experience:", error);
    throw error;
  }
};

export const updateExperience = async (id, experienceData) => {
  try {
    if (!id) {
      throw new Error("Cannot update experience without an ID");
    }
    
    // Remove client-side only fields
    const { tempId, ...dataToSend } = experienceData;
    
    // Format dates for the API
    const formattedData = {
      ...dataToSend,
      startDate: dataToSend.startDate ? dataToSend.startDate.split('T')[0] : null,
      endDate: dataToSend.endDate ? dataToSend.endDate.split('T')[0] : null
    };
    
    console.log(`Updating experience ${id} with data:`, formattedData);
    const response = await apiClient.put(`/experiences/${id}`, formattedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating experience ${id}:`, error);
    throw error;
  }
};

// Improved deleteExperience function
export const deleteExperience = async (id) => {
  
    if (!id) {
        console.error("Cannot delete experience: Missing ID");
      throw new Error("Cannot delete experience: Missing ID");
    }
    
    try {
    console.log(`Deleting experience ${id}`);
    await apiClient.delete(`/experiences/${id}`);
    console.log(`Experience ${id} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting experience ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Education API
export const getUserEducations = async () => {
  try {
    const response = await apiClient.get("/educations");
    return response.data;
  } catch (error) {
    console.error("Error fetching user educations", error);
    throw error;
  }
};


export const createEducation = async (educationData) => {
    try {
        const { tempId, ...dataToSend } = educationData;
        // Format dates for the API
        const formattedData = {
            ...dataToSend,
            startDate: dataToSend.startDate ? dataToSend.startDate.split('T')[0] : null,
            endDate: dataToSend.endDate ? dataToSend.endDate.split('T')[0] : null
        };
      const response = await apiClient.post("/educations", formattedData);
      return response.data;
    } catch (error) {
      console.error("Error creating education", error);
      throw error;
    }
};

export const updateEducation = async (id, educationData) => {
    try {
      const response = await apiClient.put(`/educations/${id}`, educationData);
      return response.data;
    } catch (error) {
      console.error("Error updating education", error);
      throw error;
    }
};

export const deleteEducation = async (id) => {
    try {
      await apiClient.delete(`/educations/${id}`);
    } catch (error) {
      console.error("Error deleting education", error);
      throw error;
    }
};
