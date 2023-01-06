import React from 'react'
import Layout from '../../components/layouts/Layout'
import DataTable from '../../components/widgets/DataTable'

const listPerbaikan = () => {
  const title = 'List Perbaikan';
  
  return (
    <Layout title={title}>
        <DataTable title={title} />
    </Layout>
  )
}

export default listPerbaikan