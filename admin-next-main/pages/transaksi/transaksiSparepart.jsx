import React from 'react'
import Layout from '../../components/layouts/Layout'
import DataTable from '../../components/widgets/DataTable'

const transaksiSparepart = () => {
  const title = 'Transaksi Sparepart';

  return (
    <Layout title={title}>
        <DataTable title={title} />
    </Layout>
  )
}

export default transaksiSparepart