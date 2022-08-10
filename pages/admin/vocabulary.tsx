import { NextPage } from "next";
import { Pagination } from "react-bootstrap";

const AdminVocabulary: NextPage = () => {
    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-center">
                <h1>Admin Vocabulary</h1>
            </div>
            <div className="d-flex justify-content-end">
                <div>
                    <button type="button" className="btn btn-success">Add</button>
                </div>
            </div>
            <div className="mt-3">
                <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">First</th>
                        <th scope="col">Last</th>
                        <th scope="col">Handle</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>
                            <div className="d-flex justify-content-end">
                                <button type="button" className="btn btn-primary me-1">edit</button>
                                <button type="button" className="btn btn-danger">delete</button>
                            </div>
                        </td>
                        </tr>
                        <tr>
                        <th scope="row">2</th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                        </tr>
                        <tr>
                        <th scope="row">3</th>
                        <td colSpan={2}>Larry the Bird</td>
                        <td>@twitter</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="d-flex justify-content-center">
                <Pagination size="sm">
                    <Pagination.First />
                    <Pagination.Prev />
                    <Pagination.Item>{1}</Pagination.Item>
                    <Pagination.Item>{10}</Pagination.Item>
                    <Pagination.Item>{11}</Pagination.Item>
                    <Pagination.Item active>{12}</Pagination.Item>
                    <Pagination.Item>{13}</Pagination.Item>
                    <Pagination.Ellipsis />
                    <Pagination.Item >{14}</Pagination.Item>
                    <Pagination.Next />
                    <Pagination.Last />
                </Pagination>
            </div>
        </div>
    )
}   
export default AdminVocabulary;