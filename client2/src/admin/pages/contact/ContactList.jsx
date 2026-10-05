import { useEffect, useState } from "react";

import {
  getMessages,
  deleteMessage,
  markAsRead,
} from "../../../services/contactService";

const ContactList = () => {
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await getMessages();

      if (res.data?.data) {
        setMessages(res.data.data);
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await deleteMessage(id);

      fetchMessages();

      alert("Message Deleted Successfully");
    } catch (error) {
      // console.log(error);
    }
  };

  const handleRead = async (id) => {
    try {
      await markAsRead(id);

      fetchMessages();
    } catch (error) {
      // console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="card shadow">
        <div className="card-header">
          <h4>Contact Messages</h4>
        </div>

        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Date</th>
                <th width="280">Action</th>
              </tr>
            </thead>

            <tbody>
              {messages.length > 0 ? (
                messages.map((message) => (
                  <tr key={message._id}>
                    <td>{message.name}</td>

                    <td>{message.email}</td>

                    <td>{message.phone}</td>

                    <td>{message.subject}</td>

                    <td>
                      <span
                        className={`badge ${
                          message.status === "New" ? "bg-danger" : "bg-success"
                        }`}
                      >
                        {message.status}
                      </span>
                    </td>

                    <td>{new Date(message.createdAt).toLocaleDateString()}</td>

                    <td>
                      <button
                        className="btn btn-info btn-sm me-2"
                        onClick={() =>
                          alert(
                            `Name: ${message.name}

Email: ${message.email}

Phone: ${message.phone}

Subject: ${message.subject}

Message:

${message.message}`,
                          )
                        }
                      >
                        View
                      </button>

                      {message.status === "New" && (
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleRead(message._id)}
                        >
                          Mark Read
                        </button>
                      )}

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(message._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No Contact Messages Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactList;
