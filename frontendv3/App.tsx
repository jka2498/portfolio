import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InstanceDetails from './components/InstanceDetails';
import BucketDetails from './components/BucketDetails';
import { Experience, Project } from './types';

const App: React.FC = () => {
  const [selectedInstance, setSelectedInstance] = useState<Experience | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleBack = () => {
    setSelectedInstance(null);
    setSelectedProject(null);
  };

  return (
    <Layout>
      {selectedInstance ? (
        <InstanceDetails 
          instance={selectedInstance} 
          onBack={handleBack} 
        />
      ) : selectedProject ? (
        <BucketDetails 
          project={selectedProject}
          onBack={handleBack}
        />
      ) : (
        <Dashboard 
          onViewInstance={(instance) => setSelectedInstance(instance)} 
          onViewProject={(project) => setSelectedProject(project)}
        />
      )}
    </Layout>
  );
};

export default App;