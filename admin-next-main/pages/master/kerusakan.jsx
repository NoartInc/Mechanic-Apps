import React from 'react';
import Layout from '../../components/layouts/Layout';
import DataTable from '../../components/widgets/DataTable';

const kerusakan = () => {
  const title = 'Kerusakan';
  
  return (
    <Layout title={title}>
        <DataTable title={title} />
    </Layout>
  )
}

export default kerusakan