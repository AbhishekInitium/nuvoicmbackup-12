
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { MongoClient } from "https://deno.land/x/mongo@v0.31.1/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get MongoDB URI from environment variable
    let MONGODB_URI = Deno.env.get('MONGODB_URI')
    
    if (!MONGODB_URI) {
      console.error("MONGODB_URI environment variable not set")
      return new Response(
        JSON.stringify({ error: "Database connection string not configured" }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Ensure port 3001 is used in the connection string
    if (!MONGODB_URI.includes(':3001')) {
      // If there's already a port defined in the URI, replace it
      if (MONGODB_URI.match(/:[0-9]+\//)) {
        MONGODB_URI = MONGODB_URI.replace(/:[0-9]+\//, ':3001/')
      } 
      // If no port defined but has a host, add the port
      else if (MONGODB_URI.match(/\/\/[^\/]+\//)) {
        MONGODB_URI = MONGODB_URI.replace(/\/\/([^\/]+)\//, '//$1:3001/')
      }
      console.log("Modified MongoDB URI to use port 3001")
    }

    console.log("Attempting to connect to MongoDB on port 3001...")
    
    // Test the connection
    const client = new MongoClient()
    await client.connect(MONGODB_URI)
    
    // Get the database names to verify connection
    const dbNames = await client.listDatabases()
    console.log(`Connected successfully. Found ${dbNames.length} databases.`)
    
    // Perform MongoDB operations based on the request data
    const contentType = req.headers.get('content-type') || '';
    let data = {};
    
    if (contentType.includes('application/json')) {
      try {
        data = await req.json();
      } catch (e) {
        console.log("No JSON data in request or invalid JSON");
      }
    }
    
    const db = client.database("NUVO_ICM_MAIN");
    let result = null;
    
    // Execute the requested operation
    if (data.operation) {
      switch (data.operation) {
        case 'testConnection':
          result = { connected: true, databases: dbNames.length };
          break;
        case 'getIncentiveSchemes':
          result = await db.collection("incentiveSchemes").find().toArray();
          break;
        case 'getSchemeVersions':
          if (data.schemeId) {
            result = await db.collection("incentiveSchemes")
              .find({ schemeId: data.schemeId })
              .sort({ "metadata.version": -1 })
              .toArray();
          } else {
            throw new Error("schemeId is required for getSchemeVersions operation");
          }
          break;
        case 'saveIncentiveScheme':
          if (data.scheme) {
            const schemeToSave = {
              ...data.scheme,
              metadata: {
                ...(data.scheme.metadata || {}),
                createdAt: data.scheme.metadata?.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                version: data.scheme.metadata?.version || 1,
                status: data.status || data.scheme.metadata?.status || 'DRAFT'
              }
            };
            
            const insertResult = await db.collection("incentiveSchemes").insertOne(schemeToSave);
            result = { _id: insertResult.id, success: true };
          } else {
            throw new Error("scheme is required for saveIncentiveScheme operation");
          }
          break;
        case 'updateIncentiveScheme':
          if (data.schemeId && data.updates) {
            const updatedScheme = {
              ...data.updates,
              schemeId: data.schemeId,
              metadata: {
                ...(data.updates.metadata || {}),
                createdAt: data.updates.metadata?.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                version: data.updates.metadata?.version || 1,
                status: data.status || data.updates.metadata?.status || 'DRAFT'
              }
            };
            
            const updateResult = await db.collection("incentiveSchemes").insertOne(updatedScheme);
            result = { _id: updateResult.id, success: true };
          } else {
            throw new Error("schemeId and updates are required for updateIncentiveScheme operation");
          }
          break;
        case 'getSchemeAdminConfigs':
          result = await db.collection("schemeAdminConfigs").find().toArray();
          break;
        case 'getSchemeAdminConfig':
          if (data.configId) {
            result = await db.collection("schemeAdminConfigs").findOne({ _id: data.configId });
          } else {
            throw new Error("configId is required for getSchemeAdminConfig operation");
          }
          break;
        case 'saveSchemeAdmin':
          if (data.config) {
            const configToSave = {
              ...data.config,
              updatedAt: new Date().toISOString()
            };
            
            if (data.config._id) {
              await db.collection("schemeAdminConfigs").updateOne(
                { _id: data.config._id },
                { $set: configToSave }
              );
              result = { _id: data.config._id, success: true };
            } else {
              const saveResult = await db.collection("schemeAdminConfigs").insertOne(configToSave);
              result = { _id: saveResult.id, success: true };
            }
          } else {
            throw new Error("config is required for saveSchemeAdmin operation");
          }
          break;
        default:
          throw new Error(`Unsupported operation: ${data.operation}`);
      }
    } else {
      // No operation specified, just return connection info
      result = { 
        status: "Connected", 
        message: "Successfully connected to MongoDB on port 3001",
        databases: dbNames.length
      };
    }

    // Close the MongoDB connection
    await client.close()
    
    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error("MongoDB connection error:", error.message)
    return new Response(
      JSON.stringify({ 
        error: "Failed to connect to MongoDB", 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
