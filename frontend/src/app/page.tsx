import CalculatorContainer from "@/components/calculator/CalculatorContainer";
import PointsDisplay from "@/components/gamification/PointsDisplay";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="w-full max-w-4xl px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">3D Calculator for Kids</h1>
          <p className="text-lg text-gray-600">A fun and educational calculator with 3D graphics</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Main Calculator */}
          <div className="w-full lg:w-2/3">
            <CalculatorContainer />
          </div>
          
          {/* Sidebar with Points and Info */}
          <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Progress</h2>
              <PointsDisplay size="xl" />
            </div>
            
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">How to Use</h3>
              <ul className="list-disc pl-5 text-blue-700 space-y-1">
                <li>Tap numbers to enter them</li>
                <li>Use operations to calculate</li>
                <li>Earn points for each calculation</li>
                <li>Maintain your streak!</li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Tips</h3>
              <ul className="list-disc pl-5 text-green-700 space-y-1">
                <li>Try the percentage (%) button</li>
                <li>Use ± to change signs</li>
                <li>Press AC to clear everything</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
