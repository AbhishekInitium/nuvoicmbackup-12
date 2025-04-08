
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

    // Parse request data
    let data;
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      data = await req.json();
    } else {
      return new Response(
        JSON.stringify({ error: "Content-Type must be application/json" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Get the operation to perform
    const operation = data.operation;
    if (!operation) {
      return new Response(
        JSON.stringify({ error: "Operation field is required" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Connect to MongoDB
    console.log("Connecting to MongoDB on port 3001...");
    const client = new MongoClient();
    await client.connect(MONGODB_URI);
    const db = client.database("NUVO_ICM_MAIN");

    let result;
    
    // Perform the requested operation
    switch (operation) {
      case 'getIncentiveSchemes':
        // Get all incentive schemes
        result = await db.collection("incentiveSchemes").find().toArray();
        break;
        
      case 'getSchemeVersions':
        // Get versions of a specific scheme
        if (!data.schemeId) {
          throw new Error("schemeId is required for getSchemeVersions operation");
        }
        result = await db.collection("incentiveSchemes")
          .find({ schemeId: data.schemeId })
          .sort({ "metadata.version": -1 })
          .toArray();
        break;
        
      case 'saveIncentiveScheme':
        // Save a new incentive scheme
        if (!data.scheme) {
          throw new Error("scheme is required for saveIncentiveScheme operation");
        }
        
        // Add timestamps if not present
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
        break;
        
      case 'updateIncentiveScheme':
        // Update an existing scheme by creating a new version
        if (!data.schemeId || !data.updates) {
          throw new Error("schemeId and updates are required for updateIncentiveScheme operation");
        }
        
        // Create a new version based on the updates
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
        break;
        
      case 'getSchemeAdminConfigs':
        // Get all scheme administrator configurations
        result = await db.collection("schemeAdminConfigs").find().toArray();
        break;
        
      case 'getSchemeAdminConfig':
        // Get a specific scheme administrator configuration
        if (!data.configId) {
          throw new Error("configId is required for getSchemeAdminConfig operation");
        }
        result = await db.collection("schemeAdminConfigs").findOne({ _id: data.configId });
        break;
        
      case 'saveSchemeAdmin':
        // Save a scheme administrator configuration
        if (!data.config) {
          throw new Error("config is required for saveSchemeAdmin operation");
        }
        
        // Ensure updated timestamp is set
        const configToSave = {
          ...data.config,
          updatedAt: new Date().toISOString()
        };
        
        // Check if this is an update or a new record
        if (data.config._id) {
          // Update existing config
          await db.collection("schemeAdminConfigs").updateOne(
            { _id: data.config._id },
            { $set: configToSave }
          );
          result = { _id: data.config._id, success: true };
        } else {
          // Create new config
          const saveResult = await db.collection("schemeAdminConfigs").insertOne(configToSave);
          result = { _id: saveResult.id, success: true };
        }
        break;
        
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }
    
    // Close the MongoDB connection
    await client.close();
    
    // Return the result
    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error("MongoDB operation error:", error.message);
    return new Response(
      JSON.stringify({ 
        error: "Failed to perform MongoDB operation", 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
