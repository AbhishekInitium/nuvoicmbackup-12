
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { MongoClient } from "https://deno.land/x/mongo@v0.31.1/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders 
    })
  }

  try {
    // Get MongoDB URI from environment secret
    const MONGODB_URI = Deno.env.get('MONGODB_URI')
    
    if (!MONGODB_URI) {
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

    // Parse the URI to extract database name
    const uriParts = MONGODB_URI.match(/mongodb(?:\+srv)?:\/\/[^/]+\/([^?]+)/)
    const databaseName = uriParts ? uriParts[1] : null

    if (!databaseName) {
      return new Response(JSON.stringify({ 
        error: 'Invalid MongoDB URI' 
      }), { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      })
    }

    // Create MongoDB client
    const client = new MongoClient()
    await client.connect(MONGODB_URI)
    
    // Parse the incoming request
    const { operation, data } = await req.json()

    // Initialize database
    const db = client.database(databaseName)

    // Perform operations based on the request
    switch (operation) {
      case 'getIncentiveSchemes':
        const incentiveCollection = db.collection('incentiveschemes')
        const schemes = await incentiveCollection.find().toArray()
        
        return new Response(JSON.stringify(schemes), {
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          }
        })

      case 'saveScheme':
        const saveCollection = db.collection('incentiveschemes')
        const saveResult = await saveCollection.insertOne(data)
        
        return new Response(JSON.stringify(saveResult), {
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          }
        })

      default:
        return new Response(JSON.stringify({ 
          error: 'Unsupported operation' 
        }), { 
          status: 400,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          }
        })
    }
  } catch (error) {
    console.error('MongoDB connection error:', error)
    
    return new Response(JSON.stringify({ 
      error: error.message 
    }), { 
      status: 500,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      }
    })
  }
})
