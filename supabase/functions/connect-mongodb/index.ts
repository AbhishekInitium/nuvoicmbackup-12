
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
    await client.close()
    
    return new Response(
      JSON.stringify({ 
        status: "Connected", 
        message: "Successfully connected to MongoDB on port 3001",
        databases: dbNames.length
      }),
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
