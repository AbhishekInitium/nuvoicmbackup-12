
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { MongoClient } from "https://deno.land/x/mongo@v0.31.1/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request")
    return new Response(null, { 
      headers: corsHeaders 
    })
  }

  try {
    // Get MongoDB URI from environment secret
    const MONGODB_URI = Deno.env.get('MONGODB_URI')
    
    console.log("MongoDB Edge Function called")
    
    if (!MONGODB_URI) {
      console.error("MongoDB URI not configured in environment")
      return new Response(JSON.stringify({ 
        error: 'MongoDB URI not configured' 
      }), { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      })
    }

    console.log("MongoDB URI found in environment variables")
    
    // Parse the URI to extract database name
    const uriParts = MONGODB_URI.match(/mongodb(?:\+srv)?:\/\/[^/]+\/([^?]+)/)
    const databaseName = uriParts ? uriParts[1] : null

    if (!databaseName) {
      console.error("Failed to extract database name from URI")
      return new Response(JSON.stringify({ 
        error: 'Invalid MongoDB URI format - could not extract database name' 
      }), { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      })
    }

    console.log(`Database name parsed: ${databaseName}`)
    
    // Create MongoDB client
    console.log("Initializing MongoDB client")
    const client = new MongoClient()
    
    // Log connection attempt
    console.log("Attempting to connect to MongoDB...")
    try {
      await client.connect(MONGODB_URI)
      console.log("Successfully connected to MongoDB")
    } catch (connError) {
      console.error("MongoDB connection failed:", connError)
      return new Response(JSON.stringify({ 
        error: `MongoDB connection failed: ${connError.message}`,
        details: connError
      }), { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      })
    }
    
    // Parse the incoming request
    let requestBody;
    try {
      requestBody = await req.json();
      console.log(`Received operation: ${requestBody.operation}`);
    } catch (parseError) {
      console.error("Failed to parse request body as JSON:", parseError);
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON in request body' 
      }), { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      })
    }
    
    const { operation, data } = requestBody;

    // Initialize database
    const db = client.database(databaseName)
    console.log(`Using database: ${databaseName}`)

    // Perform operations based on the request
    switch (operation) {
      case 'getIncentiveSchemes':
        console.log("Processing getIncentiveSchemes operation")
        try {
          const incentiveCollection = db.collection('incentiveschemes')
          console.log("Fetching schemes from collection")
          const schemes = await incentiveCollection.find().toArray()
          console.log(`Retrieved ${schemes.length} schemes from MongoDB`)
          
          return new Response(JSON.stringify(schemes), {
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            }
          })
        } catch (opError) {
          console.error("Error in getIncentiveSchemes operation:", opError)
          return new Response(JSON.stringify({ 
            error: `Operation failed: ${opError.message}`,
            operation: 'getIncentiveSchemes',
            details: opError
          }), { 
            status: 500,
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            }
          })
        }

      case 'saveScheme':
        console.log("Processing saveScheme operation")
        try {
          const saveCollection = db.collection('incentiveschemes')
          console.log("Attempting to save scheme to collection")
          const saveResult = await saveCollection.insertOne(data)
          console.log(`Successfully saved scheme with ID: ${saveResult.insertedId}`)
          
          return new Response(JSON.stringify(saveResult), {
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            }
          })
        } catch (opError) {
          console.error("Error in saveScheme operation:", opError)
          return new Response(JSON.stringify({ 
            error: `Operation failed: ${opError.message}`,
            operation: 'saveScheme',
            details: opError
          }), { 
            status: 500,
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            }
          })
        }

      default:
        console.error(`Unsupported operation requested: ${operation}`)
        return new Response(JSON.stringify({ 
          error: 'Unsupported operation',
          requestedOperation: operation 
        }), { 
          status: 400,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          }
        })
    }
  } catch (error) {
    console.error('General error in MongoDB edge function:', error)
    
    return new Response(JSON.stringify({ 
      error: `Edge function error: ${error.message}`,
      stack: error.stack 
    }), { 
      status: 500,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      }
    })
  }
})
