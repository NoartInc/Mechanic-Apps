import React from 'react';
import Layout from '../../components/layouts/Layout';
import DataTable from '../../components/widgets/DataTable';

const mesin = () => {
  const title = "Mesin";
  
  return (
    <Layout title={title}>
        <DataTable title={title} />
    </Layout>
  )
}

export default mesin