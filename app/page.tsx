export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Welcome to your MCP Next.js App: mcp-server-nextjs-1750126038212
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Your MCP server is available at <code className="font-mono bg-gray-100 p-1 rounded">/api/mcp</code>.
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Run <code className="font-mono bg-gray-100 p-1 rounded">npm install</code> or <code className="font-mono bg-gray-100 p-1 rounded">yarn install</code> then <code className="font-mono bg-gray-100 p-1 rounded">npm run dev</code> to start.
        </p>
      </div>
    </main>
  );
}
