import React from 'react'
import Layout from '../../components/layouts/Layout'
import DataTable from '../../components/widgets/DataTable';

const gudangMekanik = () => {
  const title = "Gudang Mekanik";

  return (
    <Layout title={title}>
        <DataTable title={title} />
    </Layout>
  )
}

export default gudangMekanik