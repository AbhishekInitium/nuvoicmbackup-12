
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { MongoClient } from "https://deno.land/x/mongo@v0.31.1/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Edge Function loaded and initialized");

serve(async (req) => {
  console.log("==== REQUEST RECEIVED ====");
  console.log(`Request method: ${req.method}`);
  console.log(`Request URL: ${req.url}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request")
    return new Response(null, { 
      headers: corsHeaders 
    })
  }

  try {
    console.log("Processing request body...");
    // Parse the incoming request
    let requestBody;
    try {
      const bodyText = await req.text();
      console.log("Request body text:", bodyText);
      
      if (!bodyText || bodyText.trim() === '') {
        console.error("Empty request body received");
        return new Response(JSON.stringify({ 
          error: 'Empty request body' 
        }), { 
          status: 400,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          }
        });
      }
      
      requestBody = JSON.parse(bodyText);
      console.log("Parsed request body:", JSON.stringify(requestBody));
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON in request body',
        details: parseError.message
      }), { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      });
    }
    
    const { operation, data } = requestBody;
    console.log(`Received operation: ${operation}`);
    
    // Get MongoDB URI from environment secret
    const MONGODB_URI = Deno.env.get('MONGODB_URI');
    
    console.log("MongoDB Edge Function called");
    
    if (!MONGODB_URI) {
      console.error("MongoDB URI not configured in environment");
      return new Response(JSON.stringify({ 
        error: 'MongoDB URI not configured' 
      }), { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      });
    }

    console.log("MongoDB URI found in environment variables");
    
    // Check if this is just a test request
    if (operation === 'test') {
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Edge function is working correctly, test operation completed' 
      }), { 
        status: 200,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      });
    }
    
    // Parse the URI to extract database name
    const uriParts = MONGODB_URI.match(/mongodb(?:\+srv)?:\/\/[^/]+\/([^?]+)/);
    const databaseName = uriParts ? uriParts[1] : null;

    if (!databaseName) {
      console.error("Failed to extract database name from URI");
      return new Response(JSON.stringify({ 
        error: 'Invalid MongoDB URI format - could not extract database name',
        uri_example: 'mongodb+srv://username:password@host/database'
      }), { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      });
    }

    console.log(`Database name parsed: ${databaseName}`);
    
    // Create MongoDB client with specific options
    console.log("Initializing MongoDB client");
    const client = new MongoClient();
    
    // Log connection attempt
    console.log("Attempting to connect to MongoDB...");
    try {
      // Add connection options that might help with TLS issues
      const connectOptions = {
        tls: true,
        tlsAllowInvalidCertificates: false,
        retryWrites: true,
      };
      
      console.log("Connecting with options:", JSON.stringify(connectOptions));
      await client.connect(MONGODB_URI, connectOptions);
      console.log("Successfully connected to MongoDB");
    } catch (connError) {
      console.error("MongoDB connection failed:", connError);
      return new Response(JSON.stringify({ 
        error: `MongoDB connection failed: ${connError.message}`,
        details: connError instanceof Error ? connError.stack : String(connError),
        uri_format: MONGODB_URI.replace(/\/\/([^:]+):[^@]+@/, "//[username]:[password]@")
      }), { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      });
    }
    
    // Initialize database
    const db = client.database(databaseName);
    console.log(`Using database: ${databaseName}`);

    // Perform operations based on the request
    switch (operation) {
      case 'getIncentiveSchemes':
        console.log("Processing getIncentiveSchemes operation");
        try {
          const incentiveCollection = db.collection('incentiveschemes');
          console.log("Fetching schemes from collection");
          const schemes = await incentiveCollection.find().toArray();
          console.log(`Retrieved ${schemes.length} schemes from MongoDB`);
          
          return new Response(JSON.stringify(schemes), {
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            }
          });
        } catch (opError) {
          console.error("Error in getIncentiveSchemes operation:", opError);
          return new Response(JSON.stringify({ 
            error: `Operation failed: ${opError.message}`,
            operation: 'getIncentiveSchemes',
            details: opError instanceof Error ? opError.stack : String(opError)
          }), { 
            status: 500,
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            }
          });
        } finally {
          try {
            await client.close();
            console.log("MongoDB connection closed");
          } catch (closeError) {
            console.error("Error closing MongoDB connection:", closeError);
          }
        }

      case 'saveScheme':
        console.log("Processing saveScheme operation");
        try {
          const saveCollection = db.collection('incentiveschemes');
          console.log("Attempting to save scheme to collection");
          const saveResult = await saveCollection.insertOne(data);
          console.log(`Successfully saved scheme with ID: ${saveResult.insertedId}`);
          
          return new Response(JSON.stringify(saveResult), {
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            }
          });
        } catch (opError) {
          console.error("Error in saveScheme operation:", opError);
          return new Response(JSON.stringify({ 
            error: `Operation failed: ${opError.message}`,
            operation: 'saveScheme',
            details: opError instanceof Error ? opError.stack : String(opError)
          }), { 
            status: 500,
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            }
          });
        } finally {
          try {
            await client.close();
            console.log("MongoDB connection closed");
          } catch (closeError) {
            console.error("Error closing MongoDB connection:", closeError);
          }
        }

      default:
        console.error(`Unsupported operation requested: ${operation}`);
        return new Response(JSON.stringify({ 
          error: 'Unsupported operation',
          requestedOperation: operation 
        }), { 
          status: 400,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          }
        });
    }
  } catch (error) {
    console.error('General error in MongoDB edge function:', error);
    
    return new Response(JSON.stringify({ 
      error: `Edge function error: ${error.message}`,
      stack: error instanceof Error ? error.stack : String(error)
    }), { 
      status: 500,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      }
    });
  }
})
