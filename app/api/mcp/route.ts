import { z } from "zod";
import { createMcpHandler } from "@vercel/mcp-adapter";


function getZodTypeFromOpenApiSchema(schema, z) {
  if (!schema) return z.any();
  const type = schema.type || "string";
  switch (type) {
    case "integer":
      return z.number().int();
    case "number":
      return z.number();
    case "boolean":
      return z.boolean();
    case "array":
      return z.array(schema.items ? getZodTypeFromOpenApiSchema(schema.items, z) : z.string());
    case "object":
      if (schema.properties) {
        const shape = {};
        for (const [propName, propSchema] of Object.entries(schema.properties)) {
          shape[propName] = getZodTypeFromOpenApiSchema(propSchema, z);
        }
        return z.object(shape);
      }
      return z.record(z.string(), z.any());
    default:
      return z.string();
  }
}

function getZodTypeFromOpenApiParam(param, z) {
  if (!param.schema) return z.string();
  return getZodTypeFromOpenApiSchema(param.schema, z);
}

function getPathParameters(parameters) {
  return (parameters || []).filter((param) => param.in === "path").map((param) => param.name);
}


const baseUrl = "https://blkmarket.ar";

const handler = createMcpHandler(
  (server) => {

    server.tool(
      "/api/v1/register",
      "REGISTER", 
      z.object({"_id": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"username": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"display_name": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"avatar": getZodTypeFromOpenApiSchema({"type":"string","nullable":true}, z).optional(),
"type": getZodTypeFromOpenApiSchema({"type":"string","enum":["user","boutique"]}, z).optional(),
"email": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"birth_date": getZodTypeFromOpenApiSchema({"anyOf":[{"type":"string"},{"type":"string","format":"date-time"}]}, z).optional(),
"password": getZodTypeFromOpenApiSchema({"type":"string","nullable":true}, z).optional(),
"phone": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"boutique_id": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"bio": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"admin": getZodTypeFromOpenApiSchema({"type":"boolean"}, z).optional(),
"fcmToken": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"device": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"dni": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"comission": getZodTypeFromOpenApiSchema({"type":"number"}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/register";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["_id","username","display_name","avatar","type","email","birth_date","password","phone","boutique_id","bio","admin","fcmToken","device","dni","comission"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/login",
      "LOGIN", 
      z.object({"username": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"password": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"email": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"fcmToken": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"device": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/login";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["username","password","email","fcmToken","device"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/logout",
      "LOGOUT", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/logout";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user",
      "GET USER DATA", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user",
      "PATCH USER", 
      z.object({"first_name": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"last_name": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"phone": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"dni": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"acceptsPickUpShipment": getZodTypeFromOpenApiSchema({"type":"boolean"}, z).optional(),
"payment_method": getZodTypeFromOpenApiSchema({"type":"object","properties":{"active":{"type":"string","nullable":true},"mercadopago":{"type":"object","properties":{"full_name":{"type":"string"},"dni":{"type":"string"},"cbu":{"type":"string"}},"required":["full_name","dni","cbu"],"additionalProperties":false},"bank_account":{"type":"object","properties":{"full_name":{"type":"string"},"dni":{"type":"string"},"cbu":{"type":"string"}},"required":["full_name","dni","cbu"],"additionalProperties":false}},"required":["active"],"additionalProperties":false}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["first_name","last_name","phone","dni","acceptsPickUpShipment","payment_method"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user",
      "DELETE USER", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/rating",
      "GET USER RATING", 
      z.object({"currentUserId": getZodTypeFromOpenApiParam({"name":"currentUserId","in":"query","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/rating";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"currentUserId","in":"query","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"currentUserId","in":"query","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/rating",
      "CREATE USER RATING", 
      z.object({"userId": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"rating": getZodTypeFromOpenApiSchema({"type":"number"}, z),
"comment": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"fullfilmentOrder": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/rating";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["userId","rating","comment","fullfilmentOrder"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/rating/{userId}",
      "GET USER RATING LIST", 
      z.object({"userId": getZodTypeFromOpenApiParam({"name":"userId","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/rating/{userId}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"userId","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"userId","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/top",
      "TOP USERS", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/top";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/profile",
      "EDIT USER", 
      z.object({"display_name": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"bio": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"avatar": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/profile";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["display_name","bio","avatar"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/preferences",
      "GET USER PREFERENCES", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/preferences";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/preferences",
      "EDIT USER PREFERENCES", 
      z.object({"preferences": getZodTypeFromOpenApiSchema({"type":"object","properties":{"gender":{"type":"string","nullable":true},"styles":{"type":"array","items":{"type":"string"}},"sizes":{"type":"array","items":{"type":"string"}}},"required":["gender","styles","sizes"],"additionalProperties":false}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/preferences";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["preferences"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/sellers",
      "GET SELLER USER", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/sellers";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/personal-data",
      "EDIT USER PERSONAL DATA", 
      z.object({"first_name": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"last_name": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"dni": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"phone": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/personal-data";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["first_name","last_name","dni","phone"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/follow",
      "FOLLOW USER", 
      z.object({"userId": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/follow";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["userId"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/change-password",
      "CHANGE PASSWORD", 
      z.object({"old_password": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"new_password": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/change-password";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["old_password","new_password"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/recover-password/start",
      "VALIDATE EMAIL AVAILABILITY FOR RECOVER PASSWORD", 
      z.object({"email": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/recover-password/start";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["email"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/recover-password/send",
      "SEND EMAIL VALIDATION CODE FOR RECOVER", 
      z.object({"email": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/recover-password/send";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["email"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/password",
      "USER HAS PASSWORD", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/password";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/create-new-password",
      "CREATE NEW PASSWORD FOR OAUTH USER", 
      z.object({"new_password": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/create-new-password";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["new_password"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/create-password",
      "SET NEW PASSWORD (RECOVER)", 
      z.object({"userEmail": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"new_password": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"code": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/create-password";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["userEmail","new_password","code"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/followed",
      "GET USER FOLLOWED", 
      z.object({"userId": getZodTypeFromOpenApiParam({"name":"userId","in":"query","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/followed";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"userId","in":"query","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"userId","in":"query","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/followers",
      "GET USER FOLLOWERS", 
      z.object({"userId": getZodTypeFromOpenApiParam({"name":"userId","in":"query","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/followers";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"userId","in":"query","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"userId","in":"query","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/followers/count",
      "GET USER FOLLOWERS COUNT", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/followers/count";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/availability/username",
      "VALIDATE USERNAME AVAILABILITY", 
      z.object({"username": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/availability/username";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["username"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/availability/email",
      "VALIDATE EMAIL AVAILABILITY", 
      z.object({"email": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/availability/email";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["email"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/availability/phone",
      "VALIDATE PHONE AVAILABILITY", 
      z.object({"phone": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/availability/phone";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["phone"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/email/send",
      "SEND EMAIL VALIDATION CODE", 
      z.object({"email": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/email/send";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["email"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/email/verify",
      "VERIFY EMAIL CODE", 
      z.object({"email": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"code": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/email/verify";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["email","code"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/balance",
      "GET USER BALANCE", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/balance";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/movements",
      "GET USER MOVEMENTS", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/movements";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/movements",
      "ADD USER MOVEMENTS", 
      z.object({"type": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"amount": getZodTypeFromOpenApiSchema({"type":"number"}, z),
"description": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"transactionId": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"orderId": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"previousBalance": getZodTypeFromOpenApiSchema({"type":"number"}, z).optional(),
"adminId": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/movements";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["type","amount","description","transactionId","orderId","previousBalance","adminId"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/report",
      "REPORT USER", 
      z.object({"userId": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"reason": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"details": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/report";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["userId","reason","details"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/{username}",
      "GET USER BY USERNAME", 
      z.object({"username": getZodTypeFromOpenApiParam({"name":"username","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/{username}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"username","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"username","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/{username}/shop",
      "SHOP", 
      z.object({"username": getZodTypeFromOpenApiParam({"name":"username","in":"path","required":true,"schema":{"type":"string"}}, z),
"skip": getZodTypeFromOpenApiSchema({"type":"number"}, z).optional(),
"limit": getZodTypeFromOpenApiSchema({"type":"number"}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/{username}/shop";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"username","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = ["skip","limit"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"username","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/{username}/shop/paused",
      "GET USER PAUSED PRODUCTS", 
      z.object({"username": getZodTypeFromOpenApiParam({"name":"username","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/{username}/shop/paused";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"username","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"username","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/{username}/likes",
      "LIKES", 
      z.object({"username": getZodTypeFromOpenApiParam({"name":"username","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/{username}/likes";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"username","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"username","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/block",
      "BLOCK USER", 
      z.object({"userId": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/block";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["userId"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/unblock",
      "UNBLOCK USER", 
      z.object({"userId": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/unblock";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["userId"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/blocked",
      "GET BLOCKED USERS", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/blocked";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/blocked/{userId}",
      "IS BLOCKED BY USER", 
      z.object({"userId": getZodTypeFromOpenApiParam({"name":"userId","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/blocked/{userId}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"userId","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"userId","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/deleteFull",
      "DELETE FULL USER", 
      z.object({"id": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/deleteFull";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["id"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/comission",
      "GET CURRENT USER COMISSION", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/comission";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/user/flex",
      "UPDATE PICKUP SHIPMENT", 
      z.object({"flex": getZodTypeFromOpenApiSchema({"type":"boolean"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/user/flex";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["flex"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/analytics/demography",
      "GET USER DEMOGRAPHY", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/analytics/demography";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/offers/{as}",
      "GET OFFERS", 
      z.object({"as": getZodTypeFromOpenApiParam({"name":"as","in":"path","required":true,"schema":{"type":"string","enum":["seller","bidder"]}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/offers/{as}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"as","in":"path","required":true,"schema":{"type":"string","enum":["seller","bidder"]}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"as","in":"path","required":true,"schema":{"type":"string","enum":["seller","bidder"]}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/offer/{as}/{offer}",
      "GET OFFER", 
      z.object({"offer": getZodTypeFromOpenApiParam({"name":"offer","in":"path","required":true,"schema":{"type":"string"}}, z),
"as": getZodTypeFromOpenApiParam({"name":"as","in":"path","required":true,"schema":{"type":"string","enum":["seller","bidder"]}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/offer/{as}/{offer}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"offer","in":"path","required":true,"schema":{"type":"string"}},{"name":"as","in":"path","required":true,"schema":{"type":"string","enum":["seller","bidder"]}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"offer","in":"path","required":true,"schema":{"type":"string"}},{"name":"as","in":"path","required":true,"schema":{"type":"string","enum":["seller","bidder"]}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/offer/create",
      "CREATE OFFER", 
      z.object({"product": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"offer_price": getZodTypeFromOpenApiSchema({"type":"number"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/offer/create";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["product","offer_price"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/offer/update",
      "UPDATE OFFER", 
      z.object({"offer": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"status": getZodTypeFromOpenApiSchema({"type":"string","enum":["accepted","rejected","cancelled","completed","expired"]}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/offer/update";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["offer","status"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/search",
      "SEARCH PRODUCTS", 
      z.object({"user": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"gender": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"categories": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"styles": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"color": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"status": getZodTypeFromOpenApiSchema({}, z).optional(),
"skip": getZodTypeFromOpenApiSchema({"type":"number"}, z).optional(),
"limit": getZodTypeFromOpenApiSchema({"type":"number"}, z).optional(),
"name": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/search";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["user","gender","categories","styles","color","status","skip","limit","name"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product",
      "CREATE PRODUCT", 
      z.object({"type": getZodTypeFromOpenApiSchema({"type":"string","enum":["BOUTIQUE","MARKETPLACE"]}, z),
"categories": getZodTypeFromOpenApiSchema({"type":"array","items":{"type":"string"}}, z).optional(),
"gender": getZodTypeFromOpenApiSchema({"type":"string","nullable":true}, z).optional(),
"name": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"brand": getZodTypeFromOpenApiSchema({"type":"string","nullable":true}, z).optional(),
"state": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"description": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"styles": getZodTypeFromOpenApiSchema({"type":"array","items":{"type":"string"}}, z).optional(),
"images": getZodTypeFromOpenApiSchema({"type":"array","items":{"type":"string"}}, z),
"price": getZodTypeFromOpenApiSchema({"type":"number"}, z),
"size": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"color": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"status": getZodTypeFromOpenApiSchema({"type":"string","enum":["pending","active","paused","deleted","rejected"],"default":"pending"}, z).optional(),
"slug": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["type","categories","gender","name","brand","state","description","styles","images","price","size","color","status","slug"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/featured",
      "SEARCH FEATURED PRODUCTS", 
      z.object({"user": getZodTypeFromOpenApiParam({"name":"user","in":"query","required":false,"schema":{"type":"string"}}, z).optional(),
"gender": getZodTypeFromOpenApiParam({"name":"gender","in":"query","required":false,"schema":{"type":"string"}}, z).optional(),
"categories": getZodTypeFromOpenApiParam({"name":"categories","in":"query","required":false,"schema":{"type":"string"}}, z).optional(),
"styles": getZodTypeFromOpenApiParam({"name":"styles","in":"query","required":false,"schema":{"type":"string"}}, z).optional(),
"color": getZodTypeFromOpenApiParam({"name":"color","in":"query","required":false,"schema":{"type":"string"}}, z).optional(),
"status": getZodTypeFromOpenApiParam({"name":"status","in":"query","required":false,"schema":{"type":"string","enum":["active","paused","deleted","pending","rejected"],"default":"active"}}, z).optional(),
"skip": getZodTypeFromOpenApiParam({"name":"skip","in":"query","required":false,"schema":{"type":"number"}}, z).optional(),
"limit": getZodTypeFromOpenApiParam({"name":"limit","in":"query","required":false,"schema":{"type":"number"}}, z).optional(),
"name": getZodTypeFromOpenApiParam({"name":"name","in":"query","required":false,"schema":{"type":"string"}}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/featured";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"user","in":"query","required":false,"schema":{"type":"string"}},{"name":"gender","in":"query","required":false,"schema":{"type":"string"}},{"name":"categories","in":"query","required":false,"schema":{"type":"string"}},{"name":"styles","in":"query","required":false,"schema":{"type":"string"}},{"name":"color","in":"query","required":false,"schema":{"type":"string"}},{"name":"status","in":"query","required":false,"schema":{"type":"string","enum":["active","paused","deleted","pending","rejected"],"default":"active"}},{"name":"skip","in":"query","required":false,"schema":{"type":"number"}},{"name":"limit","in":"query","required":false,"schema":{"type":"number"}},{"name":"name","in":"query","required":false,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"user","in":"query","required":false,"schema":{"type":"string"}},{"name":"gender","in":"query","required":false,"schema":{"type":"string"}},{"name":"categories","in":"query","required":false,"schema":{"type":"string"}},{"name":"styles","in":"query","required":false,"schema":{"type":"string"}},{"name":"color","in":"query","required":false,"schema":{"type":"string"}},{"name":"status","in":"query","required":false,"schema":{"type":"string","enum":["active","paused","deleted","pending","rejected"],"default":"active"}},{"name":"skip","in":"query","required":false,"schema":{"type":"number"}},{"name":"limit","in":"query","required":false,"schema":{"type":"number"}},{"name":"name","in":"query","required":false,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/delete0PriceVariants",
      "FIX 0 PRICE VARIANTS", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/delete0PriceVariants";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/addrandom",
      "ADD RANDOM NUMBER", 
      z.object({"changeAll": getZodTypeFromOpenApiSchema({"type":"boolean","default":false}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/addrandom";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["changeAll"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/disable-gift-cards",
      "DISABLE GIFT CARDS PRODUCTS", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/disable-gift-cards";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/{id}",
      "GET PRODUCT BY ID", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/{id}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/{id}",
      "UPDATE PRODUCT", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
"data": getZodTypeFromOpenApiSchema({"type":"object","properties":{"type":{"type":"string","enum":["BOUTIQUE","MARKETPLACE"]},"categories":{"type":"array","items":{"type":"string"}},"gender":{"type":"string","nullable":true},"name":{"type":"string"},"brand":{"type":"string","nullable":true},"state":{"type":"string"},"description":{"type":"string"},"styles":{"type":"array","items":{"type":"string"}},"images":{"type":"array","items":{"type":"string"}},"price":{"type":"number"},"size":{"type":"string"},"color":{"type":"string"},"status":{"type":"string","enum":["pending","active","paused","deleted","rejected"],"default":"pending"},"slug":{"type":"string"},"variants":{"type":"array","items":{"type":"string"}},"productVariantId":{"type":"string"},"discount":{"type":"number","nullable":true},"external_categories":{"type":"array","items":{"anyOf":[{"type":"string"},{"type":"number"}]}}},"additionalProperties":false}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/{id}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = ["data"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/{id}",
      "DELETE PRODUCT", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/{id}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/{id}/related",
      "GET RELATED PRODUCTS", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/{id}/related";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/{id}/related-typesense",
      "GET RELATED PRODUCTS TYPESENSE", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/{id}/related-typesense";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/{id}/status",
      "SET PRODUCT STATUS", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
"status": getZodTypeFromOpenApiSchema({"type":"string","enum":["active","paused","deleted","pending","rejected"]}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/{id}/status";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = ["status"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/{id}/discount",
      "SET PRODUCT VARIANT STATUS", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
"discount": getZodTypeFromOpenApiSchema({"type":"number"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/{id}/discount";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = ["discount"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/feature",
      "FEATURE PRODUCT", 
      z.object({"id": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/feature";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["id"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/setGender",
      "SET GENDER TO ALL USER PRODUCTS", 
      z.object({"userId": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"genderId": getZodTypeFromOpenApiSchema({"type":"string","nullable":true}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/setGender";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["userId","genderId"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/pauseProductsWithoutImages",
      "PAUSE PRODUCTS WITHOUT IMAGES", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/pauseProductsWithoutImages";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/updateUSDProductPrices",
      "UPDATE USD PRODUCT PRICES", 
      z.object({"token": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/updateUSDProductPrices";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["token"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/deleteUserPausedProducts",
      "DELETE USER PAUSED PRODUCTS", 
      z.object({"userId": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/deleteUserPausedProducts";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["userId"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/fixDiscounts",
      "FIX DISCOUNTS", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/fixDiscounts";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/generateAllSlugs",
      "GENERATE ALL SLUGS", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/generateAllSlugs";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/fixRepeatedSlugs",
      "FIX REPEATED SLUGS", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/fixRepeatedSlugs";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/metaQuery",
      "META QUERY", 
      z.object({"ids": getZodTypeFromOpenApiSchema({"type":"array","items":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/metaQuery";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["ids"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/brand/all",
      "GET ALL BRANDS", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/brand/all";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/brand/{id}",
      "GET BRAND BY ID", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/brand/{id}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/brand/{id}",
      "DELETE BRAND", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/brand/{id}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/brand/{id}",
      "EDIT BRAND", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
"name": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/brand/{id}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = ["name"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/brand/name/{term}",
      "GET BRANDS BY NAME", 
      z.object({"term": getZodTypeFromOpenApiParam({"name":"term","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/brand/name/{term}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"term","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"term","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/brand",
      "CREATE BRAND", 
      z.object({"name": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/brand";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["name"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/color/all",
      "GET ALL COLORS", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/color/all";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/color/{name}",
      "GET COLOR BY NAME", 
      z.object({"name": getZodTypeFromOpenApiParam({"name":"name","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/color/{name}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"name","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"name","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/color",
      "CREATE COLOR", 
      z.object({"name": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"hex": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/color";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["name","hex"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/color/{id}",
      "DELETE COLOR", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/color/{id}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/color/{id}",
      "EDIT COLOR", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
"name": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"hex": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/color/{id}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = ["name","hex"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/gender/all",
      "GET ALL GENDERS", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/gender/all";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/gender/update",
      "UPDATE PRODUCT GENDER", 
      z.object({"gender": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"word": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/gender/update";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["gender","word"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/size/by-attributes",
      "GET SIZES BY CATEGORY & GENDER", 
      z.object({"category": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"gender": getZodTypeFromOpenApiSchema({"type":"string","nullable":true}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/size/by-attributes";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["category","gender"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/size/by-categoryname",
      "GET SIZES BY CATEGORY NAME & GENDER", 
      z.object({"categoryName": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"genderId": getZodTypeFromOpenApiSchema({"type":"string","nullable":true}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/size/by-categoryname";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["categoryName","genderId"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/size/all",
      "GET ALL SIZES", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/size/all";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/size/{name}",
      "GET SIZE BY NAME", 
      z.object({"name": getZodTypeFromOpenApiParam({"name":"name","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/size/{name}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"name","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"name","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/size/{id}",
      "DELETE SIZE", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/size/{id}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/size/{id}",
      "EDIT SIZE", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
"name": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"gender": getZodTypeFromOpenApiSchema({"anyOf":[{"type":"array","items":{"type":"string"}},{"enum":["null"],"nullable":true}]}, z),
"categories": getZodTypeFromOpenApiSchema({"anyOf":[{"type":"array","items":{"type":"string"}},{"enum":["null"],"nullable":true}]}, z),
"similar_sizes": getZodTypeFromOpenApiSchema({"type":"array","items":{"type":"string"}}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/size/{id}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = ["name","gender","categories","similar_sizes"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/size",
      "CREATE SIZE", 
      z.object({"name": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"gender": getZodTypeFromOpenApiSchema({"anyOf":[{"type":"array","items":{"type":"string"}},{"enum":["null"],"nullable":true}]}, z),
"categories": getZodTypeFromOpenApiSchema({"anyOf":[{"type":"array","items":{"type":"string"}},{"enum":["null"],"nullable":true}]}, z),
"similar_sizes": getZodTypeFromOpenApiSchema({"type":"array","items":{"type":"string"}}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/size";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["name","gender","categories","similar_sizes"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/state/all",
      "GET STATES", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/state/all";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/state/{name}",
      "GET STATE BY NAME", 
      z.object({"name": getZodTypeFromOpenApiParam({"name":"name","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/state/{name}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"name","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"name","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/style/all",
      "GET STYLES", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/style/all";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/style/featured",
      "GET FEATURED STYLES", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/style/featured";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/style/{id}",
      "GET STYLE BY ID", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/style/{id}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/style/{id}",
      "DELETE STYLES", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/style/{id}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/style/{id}",
      "EDIT STYLES", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
"name": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"images": getZodTypeFromOpenApiSchema({"type":"array","items":{"type":"string"}}, z),
"parent_id": getZodTypeFromOpenApiSchema({"type":"string","nullable":true}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/style/{id}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = ["name","images","parent_id"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/style",
      "CREATE STYLES", 
      z.object({"name": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"images": getZodTypeFromOpenApiSchema({"type":"array","items":{"type":"string"}}, z),
"parent_id": getZodTypeFromOpenApiSchema({"type":"string","nullable":true}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/style";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["name","images","parent_id"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/{id}/like",
      "GET PRODUCT LIKES", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/{id}/like";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/{id}/like",
      "DELETE LIKE", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/{id}/like";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/like",
      "LIKE PRODUCT", 
      z.object({"id": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/like";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["id"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/like/{id}",
      "GET USER LIKED PRODUCTS", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/like/{id}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/{id}/comment",
      "GET PRODUCT COMMENTS", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/{id}/comment";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/{id}/comment",
      "CREATE COMMENT TO PRODUCT", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
"comment": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/{id}/comment";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = ["comment"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/{id}/comment",
      "DELETE COMMENT", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/{id}/comment";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/comment/{id}",
      "REPLY TO COMMENT", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
"reply_text": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/comment/{id}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = ["reply_text"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/comment/{id}/reply/{replyId}",
      "DELETE REPLY", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
"replyId": getZodTypeFromOpenApiParam({"name":"replyId","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/comment/{id}/reply/{replyId}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}},{"name":"replyId","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}},{"name":"replyId","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/category/all",
      "GET ALL CATEGORIES", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/category/all";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/category/featured",
      "GET FEATURED CATEGORIES", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/category/featured";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/category",
      "CREATE CATEGORY", 
      z.object({"name": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"images": getZodTypeFromOpenApiSchema({"type":"array","items":{"type":"string"}}, z),
"gender": getZodTypeFromOpenApiSchema({"anyOf":[{"type":"array","items":{"type":"string"}},{"enum":["null"],"nullable":true}]}, z),
"parent_category": getZodTypeFromOpenApiSchema({"anyOf":[{"type":"string"},{"enum":["null"],"nullable":true}]}, z),
"similar_categories": getZodTypeFromOpenApiSchema({"type":"array","items":{"type":"string"}}, z).optional(),
"height": getZodTypeFromOpenApiSchema({"type":"number"}, z).optional(),
"width": getZodTypeFromOpenApiSchema({"type":"number"}, z).optional(),
"length": getZodTypeFromOpenApiSchema({"type":"number"}, z).optional(),
"weight": getZodTypeFromOpenApiSchema({"type":"number"}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/category";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["name","images","gender","parent_category","similar_categories","height","width","length","weight"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/category/[id]",
      "CREATE SUBCATEGORY", 
      z.object({"name": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"parent_category": getZodTypeFromOpenApiSchema({"anyOf":[{"type":"string"},{"enum":["null"],"nullable":true}]}, z),
"gender": getZodTypeFromOpenApiSchema({"anyOf":[{"type":"array","items":{"type":"string"}},{"enum":["null"],"nullable":true}]}, z),
"similar_categories": getZodTypeFromOpenApiSchema({"type":"array","items":{"type":"string"}}, z).optional(),
"width": getZodTypeFromOpenApiSchema({"type":"number"}, z).optional(),
"height": getZodTypeFromOpenApiSchema({"type":"number"}, z).optional(),
"length": getZodTypeFromOpenApiSchema({"type":"number"}, z).optional(),
"weight": getZodTypeFromOpenApiSchema({"type":"number"}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/category/[id]";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["name","parent_category","gender","similar_categories","width","height","length","weight"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/category/{id}",
      "DELETE CATEGORY", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/category/{id}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/category/{id}",
      "GET CATEGORY BY ID", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/category/{id}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/product/category/gender",
      "GET CATEGORY BY GENDER", 
      z.object({"gender": getZodTypeFromOpenApiSchema({"type":"string","nullable":true}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/product/category/gender";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["gender"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/cart",
      "GET CART", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/cart";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/cart",
      "UPDATE CART ITEM QUANTITY", 
      z.object({"item_id": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"qty": getZodTypeFromOpenApiSchema({"type":"number","minimum":1}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/cart";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["item_id","qty"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/cart",
      "ADD CART ITEM", 
      z.object({"product_id": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"variant_id": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/cart";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["product_id","variant_id"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/cart",
      "DELETE CART ITEM", 
      z.object({"item_id": getZodTypeFromOpenApiParam({"name":"item_id","in":"query","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/cart";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"item_id","in":"query","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"item_id","in":"query","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/cart/metrics",
      "GET CART METRICS", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/cart/metrics";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/cart/reset",
      "RESET CART", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/cart/reset";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/feed",
      "GET FEED", 
      z.object({"cursor": getZodTypeFromOpenApiSchema({"type":"number"}, z).optional(),
"refresh": getZodTypeFromOpenApiSchema({"type":"boolean"}, z).optional(),
"version": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"pageSize": getZodTypeFromOpenApiSchema({"anyOf":[{"type":"number","enum":[5]},{"type":"number","enum":[10]},{"type":"number","enum":[20]},{"type":"number","enum":[25]},{"type":"number","enum":[50]}],"default":10}, z).optional(),
"preferences": getZodTypeFromOpenApiSchema({"type":"object","properties":{"gender":{"type":"string","nullable":true},"styles":{"type":"array","items":{"type":"string"}},"sizes":{"type":"array","items":{"type":"string"}}},"required":["gender","styles","sizes"],"additionalProperties":false,"nullable":true}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/feed";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["cursor","refresh","version","pageSize","preferences"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/feed/v2",
      "GET FEED V2", 
      z.object({"page": getZodTypeFromOpenApiSchema({"type":"number","default":1}, z).optional(),
"refresh": getZodTypeFromOpenApiSchema({"type":"boolean","default":false}, z).optional(),
"seedForGuest": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/feed/v2";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["page","refresh","seedForGuest"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/account/address",
      "GET USER ADDRESSES", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/account/address";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/account/address",
      "CREATE USER ADDRESS", 
      z.object({"street_address": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"street_number": getZodTypeFromOpenApiSchema({"type":"number"}, z),
"floor": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"city": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"zip_code": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"state": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"country": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"originId": getZodTypeFromOpenApiSchema({"type":"number"}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/account/address";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["street_address","street_number","floor","city","zip_code","state","country","originId"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/account/address",
      "EDIT USER ADDRESS", 
      z.object({"street_address": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"street_number": getZodTypeFromOpenApiSchema({"type":"number"}, z),
"floor": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"city": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"zip_code": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"state": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"country": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"originId": getZodTypeFromOpenApiSchema({"type":"number"}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/account/address";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["street_address","street_number","floor","city","zip_code","state","country","originId"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/account/address",
      "DELETE USER ADDRESS", 
      z.object({"addressId": getZodTypeFromOpenApiParam({"name":"addressId","in":"query","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/account/address";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"addressId","in":"query","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"addressId","in":"query","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/account/payment_method",
      "GET USER PAYMENT METHOD", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/account/payment_method";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/account/payment_method",
      "UPDATE USER ACTIVE PAYMENT METHOD", 
      z.object({"owners": getZodTypeFromOpenApiSchema({"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"display_name":{"type":"string"},"id_type":{"type":"string"},"is_physical_person":{"type":"boolean"}},"required":["id","display_name","id_type","is_physical_person"],"additionalProperties":false}}, z),
"type": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"is_active": getZodTypeFromOpenApiSchema({"type":"boolean"}, z),
"currency": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"label": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"account_routing": getZodTypeFromOpenApiSchema({"type":"object","properties":{"scheme":{"type":"string"},"address":{"type":"string"}},"required":["scheme","address"],"additionalProperties":false}, z),
"bank_routing": getZodTypeFromOpenApiSchema({"type":"object","properties":{"scheme":{"type":"string"},"address":{"type":"string"},"code":{"type":"string"}},"required":["scheme","address"],"additionalProperties":false}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/account/payment_method";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["owners","type","is_active","currency","label","account_routing","bank_routing"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/account/balance",
      "GET ACCOUNT BALANCE", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/account/balance";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/account/movements",
      "GET ACCOUNT MOVEMENTS", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/account/movements";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/account/withdraw",
      "WITHDRAW ACCOUNT BALANCE", 
      z.object({"amount": getZodTypeFromOpenApiSchema({"type":"number"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/account/withdraw";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["amount"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/order",
      "GET ORDER", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/order";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/order",
      "CREATE ORDER", 
      z.object({"purge": getZodTypeFromOpenApiSchema({"type":"boolean"}, z).optional(),
"items": getZodTypeFromOpenApiSchema({"type":"array","items":{"type":"object","properties":{"boutique_provider":{"type":"string"},"type":{"type":"string","enum":["boutique","marketplace","offer"]},"seller":{"type":"string"},"products":{"type":"array","items":{"type":"object","properties":{"product":{"type":"string"},"effective_price":{"type":"number"},"offer_price":{"type":"number"},"variant":{"type":"string"},"qty":{"type":"number"}},"required":["product","effective_price","variant","qty"],"additionalProperties":false}}},"required":["type","seller","products"],"additionalProperties":false}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/order";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["purge","items"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/order/existing",
      "EXPIRE EXISTING ORDER", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/order/existing";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/order/purchases",
      "GET PURCHASES", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/order/purchases";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/order/sales",
      "GET SALES", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/order/sales";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/order/sales/{id}",
      "GET SALE", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/order/sales/{id}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/order/paymentRes",
      "GET PAYMENT MP", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"query","required":false,"schema":{"type":"string"}}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/order/paymentRes";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"query","required":false,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"query","required":false,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/order/{id}",
      "GET ORDER BY ID", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/order/{id}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/order/{id}/step",
      "UPDATE ORDER CHECKOUT STEP", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
"step": getZodTypeFromOpenApiSchema({"type":"string","enum":["summary","shipment-method","shipment-summary","payment","confirmation"]}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/order/{id}/step";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = ["step"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/order/{id}/shipment-method",
      "UPDATE ORDER SHIPMENT METHOD", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
"shipment_method": getZodTypeFromOpenApiSchema({"anyOf":[{"type":"object","properties":{"type":{"type":"string","enum":["address"]},"address":{"type":"object","properties":{"_id":{"type":"string"},"street_address":{"type":"string"},"street_number":{"type":"number"},"floor":{"type":"string"},"zip_code":{"type":"string"},"city":{"type":"string"},"state":{"type":"string"},"country":{"type":"string"}},"required":["street_address","street_number","zip_code","city","state","country"],"additionalProperties":false}},"required":["type","address"],"additionalProperties":false},{"type":"object","properties":{"type":{"type":"string","enum":["post_office"]},"post_office":{"type":"string"}},"required":["type","post_office"],"additionalProperties":false}]}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/order/{id}/shipment-method";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = ["shipment_method"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/order/shipment-type",
      "UPDATE ORDER SHIPMENT TYPE", 
      z.object({"values": getZodTypeFromOpenApiSchema({"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"data":{"type":"object","properties":{"external_id":{"type":"number"},"logistic_type":{"type":"string"},"carrier":{"type":"object","properties":{"id":{"type":"number"},"name":{"type":"string"},"logo":{"type":"string"}},"required":["id"],"additionalProperties":false},"service_type":{"type":"string"},"cost":{"type":"number"},"blk_cost":{"type":"number"},"point_id":{"type":"number","nullable":true},"estimated_delivery":{"type":"string","nullable":true},"point_description":{"type":"string","nullable":true}},"required":["logistic_type","carrier","service_type","cost"],"additionalProperties":false}},"required":["id","data"],"additionalProperties":false}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/order/shipment-type";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["values"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/order/{id}/payment",
      "CREATE ORDER PAYMENT", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
"data": getZodTypeFromOpenApiSchema({"type":"object","properties":{"transaction_amount":{"type":"number"},"payment_method_id":{"type":"string"},"payer":{"type":"object","properties":{"email":{"type":"string"},"identification":{"type":"object","properties":{"number":{"type":"string"},"type":{"type":"string"}},"required":["number","type"],"additionalProperties":false}},"required":["email","identification"],"additionalProperties":false},"installments":{"type":"number"},"issuer_id":{"type":"number","nullable":true},"token":{"type":"string"},"external_id":{"type":"number"},"fees":{"type":"number"},"feesPlusTaxes":{"type":"number"},"financingFee":{"type":"number"}},"required":["transaction_amount","payment_method_id","payer","installments","token"],"additionalProperties":false,"nullable":true}, z),
"useBalance": getZodTypeFromOpenApiSchema({"type":"boolean"}, z),
"originalTotal": getZodTypeFromOpenApiSchema({"type":"number"}, z),
"process": getZodTypeFromOpenApiSchema({"type":"boolean"}, z),
"from": getZodTypeFromOpenApiSchema({"type":"string","enum":["web","mobile"],"default":"web"}, z).optional(),
"preference": getZodTypeFromOpenApiSchema({"type":"object","properties":{"amount":{"type":"number"},"id":{"type":"string"},"prefId":{"type":"string"},"baseUrl":{"type":"string"},"backUrls":{"type":"object","properties":{"success":{"type":"string"},"pending":{"type":"string"},"failure":{"type":"string"}},"additionalProperties":false}},"required":["amount"],"additionalProperties":false}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/order/{id}/payment";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = ["data","useBalance","originalTotal","process","from","preference"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/order/{id}/preference",
      "CREATE PAYMENT PREFERENCE", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
"amount": getZodTypeFromOpenApiSchema({"type":"number"}, z),
"baseUrl": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"backUrls": getZodTypeFromOpenApiSchema({"type":"object","properties":{"success":{"type":"string"},"pending":{"type":"string"},"failure":{"type":"string"}},"additionalProperties":false}, z).optional(),
"metadata": getZodTypeFromOpenApiSchema({}, z).optional(),
"payer": getZodTypeFromOpenApiSchema({}, z).optional(),
"shipments": getZodTypeFromOpenApiSchema({}, z).optional(),
"items": getZodTypeFromOpenApiSchema({"type":"array"}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/order/{id}/preference";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = ["amount","baseUrl","backUrls","metadata","payer","shipments","items"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/order/{id}/mark-paid",
      "MARK ORDER AS PAID (ONLY FOR ADMIN)", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/order/{id}/mark-paid";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/order/quote",
      "GET ZIPPIN QUOTE", 
      z.object({"orderId": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"declaredValue": getZodTypeFromOpenApiSchema({"type":"number","default":0}, z).optional(),
"type_packaging": getZodTypeFromOpenApiSchema({"type":"string","default":"dynamic"}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/order/quote";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["orderId","declaredValue","type_packaging"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/order/{fulfillmentId}/shipment",
      "Create Shipment", 
      z.object({"fulfillmentId": getZodTypeFromOpenApiParam({"name":"fulfillmentId","in":"path","required":true,"schema":{"type":"string"}}, z),
"declaredValue": getZodTypeFromOpenApiSchema({"type":"number","default":0}, z).optional(),
"type_packaging": getZodTypeFromOpenApiSchema({"type":"string","default":"dynamic"}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/order/{fulfillmentId}/shipment";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"fulfillmentId","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = ["declaredValue","type_packaging"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"fulfillmentId","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/order/label",
      "Get Shipment Label", 
      z.object({"shipmentId": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"provider": getZodTypeFromOpenApiSchema({"type":"string","default":"zippin"}, z).optional(),
"format": getZodTypeFromOpenApiSchema({"type":"string","enum":["zpl","pdf"],"default":"pdf"}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/order/label";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["shipmentId","provider","format"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/order/return",
      "CREATE RETURN", 
      z.object({"fulfillMentOrder": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"reason": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"description": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"products": getZodTypeFromOpenApiSchema({"type":"array","items":{"type":"object","properties":{"productId":{"type":"string"},"variantId":{"type":"string"},"qty":{"type":"number"}},"required":["productId","variantId","qty"],"additionalProperties":false}}, z),
"images": getZodTypeFromOpenApiSchema({"type":"array","items":{"type":"string"}}, z),
"status": getZodTypeFromOpenApiSchema({"type":"string","enum":["pending","approved","rejected","completed","expired","shipping"]}, z),
"total": getZodTypeFromOpenApiSchema({"type":"number"}, z).optional(),
"returnShipment": getZodTypeFromOpenApiSchema({}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/order/return";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["fulfillMentOrder","reason","description","products","images","status","total","returnShipment"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/order/collectEarnings",
      "COLLECT EARNINGS", 
      z.object({"id": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/order/collectEarnings";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["id"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/order/fulfillment_order/{id}/status",
      "UPDATE FULFILLMENT ORDER STATUS", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
"status": getZodTypeFromOpenApiSchema({"type":"string","enum":["approved","rejected","shipping","expired","completed","cancelled","pending_shipment","delivered"]}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/order/fulfillment_order/{id}/status";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = ["status"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/order/fulfillment_order/{id}/shipment",
      "GENERATE ORDER SHIPMENT", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
"orderId": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"sender_name": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"address": getZodTypeFromOpenApiSchema({"type":"object","properties":{"_id":{"type":"string"},"street_address":{"type":"string"},"street_number":{"type":"number"},"floor":{"type":"string"},"zip_code":{"type":"string"},"city":{"type":"string"},"state":{"type":"string"},"country":{"type":"string"}},"required":["street_address","street_number","zip_code","city","state","country"],"additionalProperties":false}, z),
"dni": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"phone": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/order/fulfillment_order/{id}/shipment";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = ["orderId","sender_name","address","dni","phone"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/order/test-mp-items",
      "TEST MP ORDER ITEMS", 
      z.object({"orderId": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/order/test-mp-items";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["orderId"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/boutique",
      "GET BOUTIQUES", 
      z.object({"limit": getZodTypeFromOpenApiParam({"name":"limit","in":"query","required":false,"schema":{"type":"number"}}, z).optional(),
"skip": getZodTypeFromOpenApiParam({"name":"skip","in":"query","required":false,"schema":{"type":"number"}}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/boutique";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"limit","in":"query","required":false,"schema":{"type":"number"}},{"name":"skip","in":"query","required":false,"schema":{"type":"number"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"limit","in":"query","required":false,"schema":{"type":"number"}},{"name":"skip","in":"query","required":false,"schema":{"type":"number"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/boutique/top",
      "GET TOP BOUTIQUES", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/boutique/top";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/boutique/woocommerce",
      "SET ACCESS TOKEN WOOCOMMERCE", 
      z.object({"key_id": getZodTypeFromOpenApiSchema({"type":"number"}, z),
"user_id": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"consumer_key": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"consumer_secret": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"key_permissions": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/boutique/woocommerce";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["key_id","user_id","consumer_key","consumer_secret","key_permissions"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/boutique/style",
      "ADD STYLE TO BOUTIQUE", 
      z.object({"boutique_id": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"style": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/boutique/style";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["boutique_id","style"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/boutique/tiendanube/webhooks",
      "POST WEBHOOKS TIENDANUBE", 
      z.object({"access_token": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"store_id": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/boutique/tiendanube/webhooks";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["access_token","store_id"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/boutique/checkBoutiqueCredentials",
      "CHECK BOUTIQUE CREDENTIALS", 
      z.object({"boutique_id": getZodTypeFromOpenApiParam({"name":"boutique_id","in":"query","required":false,"schema":{"type":"string"}}, z).optional(),
"username": getZodTypeFromOpenApiParam({"name":"username","in":"query","required":false,"schema":{"type":"string"}}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/boutique/checkBoutiqueCredentials";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"boutique_id","in":"query","required":false,"schema":{"type":"string"}},{"name":"username","in":"query","required":false,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"boutique_id","in":"query","required":false,"schema":{"type":"string"}},{"name":"username","in":"query","required":false,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/boutique/checkAllBoutiqueCredentials",
      "CHECK ALL BOUTIQUE CREDENTIALS", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/boutique/checkAllBoutiqueCredentials";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/boutique/setInactive",
      "SET BOUTIQUE INACTIVE", 
      z.object({"store_id": getZodTypeFromOpenApiSchema({"anyOf":[{"type":"number"},{"type":"string"}]}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/boutique/setInactive";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["store_id"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/boutique/resyncCategories",
      "RESYNC CATEGORIES", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/boutique/resyncCategories";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/tiendanube/app/resumed",
      "APP RESUMED", 
      z.object({"store_id": getZodTypeFromOpenApiSchema({"type":"number"}, z),
"event": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"id": getZodTypeFromOpenApiSchema({"type":"number"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/tiendanube/app/resumed";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["store_id","event","id"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/tiendanube/app/suspended",
      "APP SUSPENDED", 
      z.object({"store_id": getZodTypeFromOpenApiSchema({"type":"number"}, z),
"event": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"id": getZodTypeFromOpenApiSchema({"type":"number"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/tiendanube/app/suspended";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["store_id","event","id"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/tiendanube/app/uninstalled",
      "APP UNINSTALLED", 
      z.object({"store_id": getZodTypeFromOpenApiSchema({"type":"number"}, z),
"event": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"id": getZodTypeFromOpenApiSchema({"type":"number"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/tiendanube/app/uninstalled";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["store_id","event","id"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/tiendanube/install",
      "INSTALL", 
      z.object({"code": getZodTypeFromOpenApiParam({"name":"code","in":"query","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/tiendanube/install";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"code","in":"query","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"code","in":"query","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/tiendanube/order/cancelled",
      "ORDER CANCEL", 
      z.object({"store_id": getZodTypeFromOpenApiSchema({"type":"number"}, z),
"event": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"id": getZodTypeFromOpenApiSchema({"type":"number"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/tiendanube/order/cancelled";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["store_id","event","id"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/tiendanube/order/packed",
      "ORDER PACKED", 
      z.object({"store_id": getZodTypeFromOpenApiSchema({"type":"number"}, z),
"event": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"id": getZodTypeFromOpenApiSchema({"type":"number"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/tiendanube/order/packed";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["store_id","event","id"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/tiendanube/product/created",
      "PRODUCT CREATED", 
      z.object({"store_id": getZodTypeFromOpenApiSchema({"type":"number"}, z),
"event": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"id": getZodTypeFromOpenApiSchema({"type":"number"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/tiendanube/product/created";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["store_id","event","id"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/tiendanube/product/updated",
      "PRODUCT UPDATED", 
      z.object({"store_id": getZodTypeFromOpenApiSchema({"type":"number"}, z),
"event": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"id": getZodTypeFromOpenApiSchema({"type":"number"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/tiendanube/product/updated";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["store_id","event","id"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/tiendanube/product/deleted",
      "PRODUCT DELETED", 
      z.object({"store_id": getZodTypeFromOpenApiSchema({"type":"number"}, z),
"event": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"id": getZodTypeFromOpenApiSchema({"type":"number"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/tiendanube/product/deleted";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["store_id","event","id"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/tiendanube/resync",
      "RESYNC BOUTIQUE", 
      z.object({"store_id": getZodTypeFromOpenApiSchema({"type":"number"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/tiendanube/resync";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["store_id"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/zippin/status",
      "ZIPPIN STATUS", 
      z.object({"topic": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"timestamp": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"data": getZodTypeFromOpenApiSchema({"type":"object","properties":{"account_id":{"type":"number"},"shipment_id":{"type":"number"},"external_id":{"type":"string"},"status":{"type":"string"},"status_code":{"type":"string"},"direction":{"type":"string"}},"additionalProperties":false}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/zippin/status";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["topic","timestamp","data"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/epick/status",
      "EPICK STATUS", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/epick/status";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/woocommerce/{wooid}/product/created",
      "PRODUCT CREATED", 
      z.object({"wooid": getZodTypeFromOpenApiParam({"name":"wooid","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/woocommerce/{wooid}/product/created";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"wooid","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"wooid","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/woocommerce/{wooid}/product/updated",
      "PRODUCT UPDATED", 
      z.object({"wooid": getZodTypeFromOpenApiParam({"name":"wooid","in":"path","required":true,"schema":{"type":"string"}}, z),
"refreshActive": getZodTypeFromOpenApiSchema({"type":"boolean"}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/woocommerce/{wooid}/product/updated";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"wooid","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = ["refreshActive"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"wooid","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/woocommerce/{wooid}/product/deleted",
      "PRODUCT DELETED", 
      z.object({"wooid": getZodTypeFromOpenApiParam({"name":"wooid","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/woocommerce/{wooid}/product/deleted";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"wooid","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"wooid","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/woocommerce/fix",
      "Fix WOO", 
      z.object({"key": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"secret": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"website": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"wooid": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"refreshActive": getZodTypeFromOpenApiSchema({"type":"boolean","default":true}, z).optional(),
"onlyMissing": getZodTypeFromOpenApiSchema({"type":"boolean","default":false}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/woocommerce/fix";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["key","secret","website","wooid","refreshActive","onlyMissing"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/shopify/verify/{id}",
      "VERIFY INSTALL", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/shopify/verify/{id}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/shopify/install",
      "INSTALL", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/shopify/install";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/shopify/product/created",
      "PRODUCT CREATED", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/shopify/product/created";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/shopify/product/updated",
      "PRODUCT UPDATED", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/shopify/product/updated";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/shopify/product/deleted",
      "PRODUCT DELETED", 
      z.object({"id": getZodTypeFromOpenApiSchema({"type":"number"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/shopify/product/deleted";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["id"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/shopify/app/uninstalled",
      "APP UNINSTALLED", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/shopify/app/uninstalled";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/shopify/resync",
      "SHOPIFY RESYNC", 
      z.object({"website": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"checkPaused": getZodTypeFromOpenApiSchema({"type":"boolean","default":true}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/shopify/resync";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["website","checkPaused"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/shopify/postWebhooks",
      "SHOPIFY POST WEBHOOKS", 
      z.object({"website": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"token": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/shopify/postWebhooks";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["website","token"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/webhooks/mercadopago",
      "MERCADOPAGO WEBHOOK", 
      z.object({"type": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"action": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"api_version": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"data": getZodTypeFromOpenApiSchema({"type":"object","properties":{"id":{"type":"string"}},"additionalProperties":{}}, z),
"date_created": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"id": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"live_mode": getZodTypeFromOpenApiSchema({"type":"boolean"}, z),
"user_id": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/webhooks/mercadopago";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["type","action","api_version","data","date_created","id","live_mode","user_id"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/grid/products",
      "GET GRID PRODUCTS", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/grid/products";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/grid/product",
      "GET GRID PRODUCT", 
      z.object({"productId": getZodTypeFromOpenApiParam({"name":"productId","in":"query","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/grid/product";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"productId","in":"query","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"productId","in":"query","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/grid/product/created",
      "GRID PRODUCT CREATED", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/grid/product/created";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/grid/product/updated",
      "GRID PRODUCT UPDATED", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/grid/product/updated";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/grid/product/deleted",
      "GRID PRODUCT DELETED", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/grid/product/deleted";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/grid/setToken",
      "SET ACCESS TOKEN GRID", 
      z.object({"boutique_id": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"access_token": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"store_id": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/grid/setToken";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["boutique_id","access_token","store_id"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/epick/activate",
      "ACTIVATE EPICK", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/epick/activate";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/resource",
      "CREATE RESOURCE", 
      z.object({"tag": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"permissions": getZodTypeFromOpenApiSchema({"type":"array","items":{"type":"object","properties":{"role":{"type":"string"},"actions":{"type":"string"}},"required":["role","actions"],"additionalProperties":false}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/resource";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["tag","permissions"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/push-notifications",
      "GET PUSH NOTIFICATIONS", 
      z.object({"page": getZodTypeFromOpenApiSchema({"type":"number"}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/push-notifications";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["page"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/notifications/read",
      "MARK ALL NOTIFICATIONS AS READ", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/notifications/read";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/notifications/topics",
      "GET TOPICS", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/notifications/topics";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/notifications/preferences",
      "GET NOTIFICATIONS PREFERENCES", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/notifications/preferences";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/notifications/preferences",
      "SET NOTIFICATIONS PREFERENCES", 
      z.object({"preferences": getZodTypeFromOpenApiSchema({"type":"array","items":{"type":"object","properties":{"code":{"type":"string","enum":["user:followed","user:rated","user:acceptedReturn","user:rejectedReturn","user:balanceUpdated","user:withdrawalUpdated","offer:received","offer:accepted","offer:rejected","product:liked","product:commented","product:reply","product:approved","product:rejected","order:created","order:updated","purchase:accepted","purchase:received","purchase:updated","global:promotion"]},"channels":{"type":"array","items":{"type":"string","enum":["email","push"]}},"configurable":{"type":"boolean"},"label":{"type":"string"},"enabled":{"type":"array","items":{"type":"string","enum":["email","push"]}}},"required":["code","channels","configurable","label","enabled"],"additionalProperties":false}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/notifications/preferences";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["preferences"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/notifications/create",
      "CREATE NOTIFICATION", 
      z.object({"tag": getZodTypeFromOpenApiSchema({"type":"string","enum":["marketplace","social"]}, z),
"topic": getZodTypeFromOpenApiSchema({"type":"string","enum":["user:followed","user:rated","user:acceptedReturn","user:rejectedReturn","user:balanceUpdated","user:withdrawalUpdated","offer:received","offer:accepted","offer:rejected","product:liked","product:commented","product:reply","product:approved","product:rejected","order:created","order:updated","purchase:accepted","purchase:received","purchase:updated","global:promotion"]}, z),
"title": getZodTypeFromOpenApiSchema({"type":"string","nullable":true}, z).optional(),
"message": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"userId": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"link": getZodTypeFromOpenApiSchema({"type":"string","nullable":true}, z).optional(),
"payload": getZodTypeFromOpenApiSchema({"type":"object","properties":{"user":{"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"},"img":{"type":"string"}},"required":["id","name","img"],"additionalProperties":false},"resource":{"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"},"img":{"type":"string"}},"required":["id","name","img"],"additionalProperties":false}},"additionalProperties":false}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/notifications/create";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["tag","topic","title","message","userId","link","payload"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/notifications/email/test",
      "SEND EMAIL NOTIFICATION", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/notifications/email/test";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/notifications/notifyusers",
      "NOTIFY MATCHING USERS", 
      z.object({"title": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"message": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"match": getZodTypeFromOpenApiSchema({}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/notifications/notifyusers";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["title","message","match"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/scheduler/execute",
      "EXECUTE A PREVIOUSLY SCHEDULED JOB", 
      z.object({"job": getZodTypeFromOpenApiSchema({"anyOf":[{"type":"object","properties":{"tag":{"type":"string","enum":["fulorder:expire"]},"buyerId":{"type":"string"},"orderId":{"type":"string"},"fulfillmentId":{"type":"string"},"sellerId":{"type":"string"}},"required":["tag","buyerId","orderId","fulfillmentId","sellerId"],"additionalProperties":false},{"type":"object","properties":{"tag":{"type":"string","enum":["fulorder:dropoff_expire"]},"fulfillmentId":{"type":"string"},"orderId":{"type":"string"}},"required":["tag","fulfillmentId","orderId"],"additionalProperties":false},{"type":"object","properties":{"tag":{"type":"string","enum":["fulorder:dropoff_closeto_expire"]},"fulfillmentId":{"type":"string"},"orderId":{"type":"string"}},"required":["tag","fulfillmentId","orderId"],"additionalProperties":false},{"type":"object","properties":{"tag":{"type":"string","enum":["order:collectEarnings"]},"orderId":{"type":"string"},"total":{"type":"number"},"payment_id":{"type":"string"},"processed_at":{"type":"string","format":"date-time"},"force":{"type":"boolean"}},"required":["tag","orderId","total","payment_id","processed_at"],"additionalProperties":false},{"type":"object","properties":{"tag":{"type":"string","enum":["fulorder:expire_return"]},"fulfillmentId":{"type":"string"}},"required":["tag","fulfillmentId"],"additionalProperties":false},{"type":"object","properties":{"tag":{"type":"string","enum":["return:expire"]},"fulfillmentId":{"type":"string"},"returnId":{"type":"string"}},"required":["tag","fulfillmentId","returnId"],"additionalProperties":false},{"type":"object","properties":{"tag":{"type":"string","enum":["preference:expire"]},"buyerId":{"type":"string"},"orderId":{"type":"string"},"preferenceId":{"type":"string"}},"required":["tag","buyerId","orderId","preferenceId"],"additionalProperties":false},{"type":"object","properties":{"tag":{"type":"string","enum":["return:expire-complaint"]},"fulfillmentId":{"type":"string"},"returnId":{"type":"string"}},"required":["tag","fulfillmentId","returnId"],"additionalProperties":false},{"type":"object","properties":{"tag":{"type":"string","enum":["transaction:checkStatus"]},"transactionId":{"type":"string"},"userId":{"type":"string"},"amount":{"type":"number"}},"required":["tag","transactionId","userId","amount"],"additionalProperties":false}]}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/scheduler/execute";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["job"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/payments/accounts",
      "GET ACCOUNTS", 
      z.object({}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/payments/accounts";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/payments/accounts/{account_id}/movements",
      "GET ACCOUNT MOVEMENTS", 
      z.object({"account_id": getZodTypeFromOpenApiParam({"name":"account_id","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/payments/accounts/{account_id}/movements";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"account_id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"account_id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/payments/validate/alias",
      "VALIDATE ALIAS", 
      z.object({"alias": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/payments/validate/alias";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["alias"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/payments/validate/cbu",
      "VALIDATE CBU", 
      z.object({"cbu": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/payments/validate/cbu";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["cbu"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/payments/transaction/{id}",
      "GET TRANSACTION", 
      z.object({"id": getZodTypeFromOpenApiParam({"name":"id","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/payments/transaction/{id}";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/search/reindex",
      "TEMPORARY FOR THE INTEGRATION> DO NOT USE", 
      z.object({"collection": getZodTypeFromOpenApiSchema({"type":"string","enum":["all","users","products"]}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/search/reindex";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["collection"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/search/index",
      "UPDATE INDEX BY ID", 
      z.object({"collection": getZodTypeFromOpenApiSchema({"type":"string","enum":["all","users","products"]}, z),
"ids": getZodTypeFromOpenApiSchema({"type":"array","items":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/search/index";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["collection","ids"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/search/reIndexByUserId",
      "UPDATE INDEX BY USER ID", 
      z.object({"userId": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/search/reIndexByUserId";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["userId"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/search/federated",
      "FEDERATED SEARCH WITH PRODUCTS (MARKETPLACE/BOUTIQUE), USERS", 
      z.object({"q": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"blockedUsers": getZodTypeFromOpenApiSchema({"type":"array","items":{"type":"string"}}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/search/federated";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["q","blockedUsers"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/search/products",
      "PRODUCT SEARCH", 
      z.object({"q": getZodTypeFromOpenApiSchema({"type":"string","nullable":true}, z),
"seed": getZodTypeFromOpenApiSchema({"type":"number"}, z).optional(),
"filters": getZodTypeFromOpenApiSchema({"type":"object","properties":{"type":{"type":"array","items":{"type":"string"},"nullable":true},"categories":{"type":"array","items":{"type":"string"},"nullable":true},"colors":{"type":"array","items":{"type":"string"},"nullable":true},"states":{"type":"array","items":{"type":"string"},"nullable":true},"brands":{"type":"array","items":{"type":"string"},"nullable":true},"styles":{"type":"array","items":{"type":"string"},"nullable":true},"gender":{"type":"array","items":{"type":"string"},"nullable":true},"size":{"type":"array","items":{"type":"string"},"nullable":true},"withDiscount":{"type":"array","items":{"type":"string"},"nullable":true},"acceptsExpressShipment":{"type":"boolean","nullable":true},"minPrice":{"type":"number","nullable":true},"maxPrice":{"type":"number","nullable":true}},"required":["type","categories","colors","states","brands","styles","gender","size"],"additionalProperties":false,"nullable":true}, z),
"sort": getZodTypeFromOpenApiSchema({"type":"string","enum":["likes","newest","oldest","priceAsc","priceDesc","discount"],"nullable":true}, z),
"page": getZodTypeFromOpenApiSchema({"type":"number","default":1}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/search/products";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["q","seed","filters","sort","page"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/search/users",
      "USERS SEARCH", 
      z.object({"q": getZodTypeFromOpenApiSchema({"type":"string","nullable":true}, z),
"user": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"filters": getZodTypeFromOpenApiSchema({"type":"object","properties":{"type":{"type":"array","items":{"type":"string"},"nullable":true},"acceptsExpressShipment":{"type":"boolean","nullable":true}},"required":["type","acceptsExpressShipment"],"additionalProperties":false,"nullable":true}, z),
"sort": getZodTypeFromOpenApiSchema({"type":"string","enum":["followers","rating","newest","productAmount"],"nullable":true}, z),
"page": getZodTypeFromOpenApiSchema({"type":"number","default":1}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/search/users";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["q","user","filters","sort","page"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/suggested/products",
      "GET SUGGESTED PRODUCTS", 
      z.object({"page": getZodTypeFromOpenApiSchema({"type":"number","default":1}, z).optional(),
"seed": getZodTypeFromOpenApiSchema({"type":"number"}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/suggested/products";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["page","seed"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/search/brands",
      "GET BRANDS", 
      z.object({"sort": getZodTypeFromOpenApiSchema({"type":"string","enum":["name","productCount"],"default":"name"}, z).optional(),
"q": getZodTypeFromOpenApiSchema({"type":"string","nullable":true}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/search/brands";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["sort","q"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/shipping/locations",
      "GET SHIPPING LOCATIONS", 
      z.object({"city": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"state": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"lat": getZodTypeFromOpenApiSchema({"type":"number"}, z).optional(),
"lng": getZodTypeFromOpenApiSchema({"type":"number"}, z).optional(),
"radius": getZodTypeFromOpenApiSchema({"type":"integer"}, z).optional(),
"carrier_id": getZodTypeFromOpenApiSchema({"type":"integer"}, z).optional(),
"total_weight": getZodTypeFromOpenApiSchema({"type":"integer"}, z).optional(),
"total_volume": getZodTypeFromOpenApiSchema({"type":"integer"}, z).optional(),
"package_count": getZodTypeFromOpenApiSchema({"type":"integer"}, z).optional(),
"shipment_id": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/shipping/locations";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["city","state","lat","lng","radius","carrier_id","total_weight","total_volume","package_count","shipment_id"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/shipping/dropoff_locations",
      "GET SHIPPING LOCATIONS BY SHIPMENT ID", 
      z.object({"city": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"state": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
"lat": getZodTypeFromOpenApiSchema({"type":"number"}, z).optional(),
"lng": getZodTypeFromOpenApiSchema({"type":"number"}, z).optional(),
"radius": getZodTypeFromOpenApiSchema({"type":"integer"}, z).optional(),
"carrier_id": getZodTypeFromOpenApiSchema({"type":"integer"}, z).optional(),
"total_weight": getZodTypeFromOpenApiSchema({"type":"integer"}, z).optional(),
"total_volume": getZodTypeFromOpenApiSchema({"type":"integer"}, z).optional(),
"package_count": getZodTypeFromOpenApiSchema({"type":"integer"}, z).optional(),
"shipment_id": getZodTypeFromOpenApiSchema({"type":"string"}, z).optional(),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/shipping/dropoff_locations";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["city","state","lat","lng","radius","carrier_id","total_weight","total_volume","package_count","shipment_id"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/shipping/confirm-pickup",
      "CONFIRM ORDER FOR PICKUP", 
      z.object({"fulfillmentId": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/shipping/confirm-pickup";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["fulfillmentId"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/shipping/{shipment_id}/download",
      "DOWNLOAD SHIPPING INSTRUCTIONS", 
      z.object({"shipment_id": getZodTypeFromOpenApiParam({"name":"shipment_id","in":"path","required":true,"schema":{"type":"string"}}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/shipping/{shipment_id}/download";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([{"name":"shipment_id","in":"path","required":true,"schema":{"type":"string"}}]);
          const requestBodyProperties = [];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([{"name":"shipment_id","in":"path","required":true,"schema":{"type":"string"}}].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/image",
      "GET S3 PRE SIGNED URL", 
      z.object({"assetKey": getZodTypeFromOpenApiSchema({"type":"string"}, z),
"contentType": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/image";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["assetKey","contentType"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
    server.tool(
      "/api/v1/app/check-version",
      "CHECK APP VERSION", 
      z.object({"version": getZodTypeFromOpenApiSchema({"type":"string"}, z),
}),
      
      async (params) => {
        try {
          let apiPath = "/api/v1/app/check-version";
          const queryParams = new URLSearchParams();
          const localPathParams = getPathParameters([]);
          const requestBodyProperties = ["version"];
          
          const bodyPayload = {};
          let hasBody = false;

          for (const [key, value] of Object.entries(params)) {
            if (value === undefined) continue; 

            if (localPathParams.includes(key)) {
              apiPath = apiPath.replace(`{${key}}`, String(value));
            } else if (requestBodyProperties.includes(key)) {
              bodyPayload[key] = value;
              hasBody = true;
            } else if ([].find(p => p.name === key && p.in === 'query')) {
              queryParams.append(key, String(value));
            }
          }
          if (params.requestBodyData) {
            Object.assign(bodyPayload, params.requestBodyData);
            hasBody = true;
          }

          const fullUrl = `${baseUrl}${apiPath}${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          };

          if (hasBody && ["POST", "PUT", "PATCH"].includes(requestOptions.method)) {
            requestOptions.body = JSON.stringify(bodyPayload);
          }

          const response = await fetch(fullUrl, requestOptions);
          const responseData = await response.text(); 

          let parsedData = responseData;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              parsedData = JSON.parse(responseData);
            } catch (e) { /* Keep as text if JSON parsing fails */ }
          }

          return {
            content: [{
              type: "text", 
              text: typeof parsedData === 'object' ? JSON.stringify(parsedData, null, 2) : String(parsedData),
            }],
            metadata: {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
            }
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error calling API: ${error instanceof Error ? error.message : "Unknown error"}`,
            }],
            metadata: {
                error: true,
                errorMessage: error instanceof Error ? error.message : "Unknown error",
            }
          };
        }
      }
    
    );
  },
  {},
  { basePath: "/api" }
);

export { GET, DELETE };