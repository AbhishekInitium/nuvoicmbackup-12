
import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '@/components/layout/NavBar';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const IntegrationPortal = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-app-gray-50 to-white">
      <NavBar />
      
      <div className="py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Integration Portal</h1>
            <p className="text-gray-500 mt-2">
              Manage and test your SAP system integrations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>API Testing</CardTitle>
                <CardDescription>
                  Test your SAP API connections with our built-in testing tool
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Use our API testing interface to test direct connections to your SAP system.
                </p>
                <Link to="/api-tester">
                  <Button>
                    Open API Tester
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>
                  Explore SAP API documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Access reference materials for working with SAP APIs.
                </p>
                <a href="https://api.sap.com/" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">
                    Visit API Documentation
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default IntegrationPortal;
