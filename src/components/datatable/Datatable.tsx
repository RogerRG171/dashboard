/* eslint-disable @typescript-eslint/no-explicit-any */
import "./datatable.scss"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { userColumns, userRows } from "../../mockData/datatablesource"
import { Link } from "react-router-dom"
import { useState } from "react"
import { Props } from "recharts/types/container/Surface"

type Params = {
  row: Row
}

type Row = {
  id: number
  username: string
  img: string
  status: string
  email: string
  age: number
}

const columns: GridColDef[] = userColumns

const Datatable = (props: Props) => {
  const [data, setData] = useState(userRows)

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params: Params) => {
        return (
          <div className="cellAction">
            <Link to="/users/test" style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        )
      },
    },
  ]

  //functions
  const handleDelete = (id: number) => {
    setData(data.filter((item) => item.id !== id))
  }
  return (
    <div className="datatable">
      <div className="datatableTitle">
        Add New User
        <Link to="/users/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={columns.concat(actionColumn)}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  )
}

export default Datatable
