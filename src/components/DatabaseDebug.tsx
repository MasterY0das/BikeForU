import React, { useState } from 'react';
import { DatabaseService } from '../lib/database';
import { useAuth } from '../contexts/AuthContext';

const DatabaseDebug: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runDebugFunction = async (func: () => Promise<any>, name: string) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const result = await func();
      setResults({ function: name, data: result });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const debugFunctions = [
    {
      name: 'List All Tables',
      func: () => DatabaseService.listTables()
    },
    {
      name: 'Get Public Routes',
      func: () => DatabaseService.getPublicRoutes()
    },
    {
      name: 'Get User Profile',
      func: () => user ? DatabaseService.getUserProfile(user.id) : Promise.reject('No user logged in')
    },
    {
      name: 'Get User Routes',
      func: () => user ? DatabaseService.getUserRoutes(user.id) : Promise.reject('No user logged in')
    },
    {
      name: 'Get Received Routes',
      func: () => user ? DatabaseService.getReceivedRoutes(user.id) : Promise.reject('No user logged in')
    },
    {
      name: 'Get User Friends',
      func: () => user ? DatabaseService.getUserFriends(user.id) : Promise.reject('No user logged in')
    },
    {
      name: 'Get Pending Friend Requests',
      func: () => user ? DatabaseService.getPendingFriendRequests(user.id) : Promise.reject('No user logged in')
    },
    {
      name: 'Create Test Profile',
      func: () => user ? DatabaseService.createTestProfile(user.id) : Promise.reject('No user logged in')
    },
    {
      name: 'Create Test Route',
      func: () => user ? DatabaseService.createTestRoute(user.id) : Promise.reject('No user logged in')
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Debug Panel</h1>
        
        {!user && (
          <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4 mb-6">
            <p className="text-yellow-200">
              ⚠️ You need to be logged in to test user-specific functions. 
              Some functions will work without login.
            </p>
          </div>
        )}

        {user && (
          <div className="bg-green-900 border border-green-700 rounded-lg p-4 mb-6">
            <p className="text-green-200">
              ✅ Logged in as: {user.email} (ID: {user.id})
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {debugFunctions.map((debugFunc, index) => (
            <button
              key={index}
              onClick={() => runDebugFunction(debugFunc.func, debugFunc.name)}
              disabled={loading}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg p-4 text-left transition-colors disabled:opacity-50"
            >
              <h3 className="font-semibold mb-2">{debugFunc.name}</h3>
              <p className="text-sm text-gray-400">
                {debugFunc.name.includes('Create') ? 'Creates test data' : 'Retrieves data'}
              </p>
            </button>
          ))}
        </div>

        {loading && (
          <div className="bg-blue-900 border border-blue-700 rounded-lg p-4 mb-6">
            <p className="text-blue-200">🔄 Loading...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-red-200 mb-2">Error:</h3>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {results && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-4">
              Results: {results.function}
            </h3>
            <div className="bg-black rounded p-4 overflow-auto max-h-96">
              <pre className="text-sm text-green-400">
                {JSON.stringify(results.data, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="mt-8 bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <div className="space-y-2 text-sm text-gray-300">
            <p>1. <strong>List All Tables</strong> - Shows all tables in your database</p>
            <p>2. <strong>Get Public Routes</strong> - Shows public routes from the routes table</p>
            <p>3. <strong>Get User Profile</strong> - Shows your profile data (requires login)</p>
            <p>4. <strong>Get User Routes</strong> - Shows your routes (requires login)</p>
            <p>5. <strong>Get Received Routes</strong> - Shows routes shared with you (requires login)</p>
            <p>6. <strong>Get User Friends</strong> - Shows your friends (requires login)</p>
            <p>7. <strong>Get Pending Friend Requests</strong> - Shows pending friend requests (requires login)</p>
            <p>8. <strong>Create Test Profile</strong> - Creates a test profile for you (requires login)</p>
            <p>9. <strong>Create Test Route</strong> - Creates a test route for you (requires login)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseDebug; 