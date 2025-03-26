import { useState } from 'react'
import './App.css'
import CollateralForm from './components/collateral/CollateralForm'
import CollateralList from './components/collateral/CollateralList'

function App() {
  const [refreshList, setRefreshList] = useState(false);

  const handleFormSuccess = () => {
    setRefreshList(!refreshList);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Collateral Tracker</h1>
          <p className="text-gray-600">Manage and track your collateral items</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <CollateralForm onSuccess={handleFormSuccess} />
          </div>
          <div>
            <CollateralList key={refreshList ? 'refresh' : 'initial'} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
