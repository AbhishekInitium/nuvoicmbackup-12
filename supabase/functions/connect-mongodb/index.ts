
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
    const MONGODB_URI = Deno.env.get('MONGODB_URI')
    
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

    console.log("Attempting to connect to MongoDB...")
    
    // Test the connection
    const client = new MongoClient()
    await client.connect(MONGODB_URI)
    
    // Get the database names to verify connection
    const dbNames = await client.listDatabases()
    await client.close()
    
    return new Response(
      JSON.stringify({ 
        status: "Connected", 
        message: "Successfully connected to MongoDB",
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
