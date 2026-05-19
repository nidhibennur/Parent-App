import React, {
  useState,
  useEffect
} from "react";

const Blogs = () => {

  // Documents State
  const [documents, setDocuments] =
    useState([]);

  // Pagination State
  const [currentPage, setCurrentPage] =
    useState(1);

  // Cards Per Page
  const cardsPerPage = 8;

  // Fetch Data
  useEffect(() => {

    const fetchData = async () => {

      try {

        // Example API Response
        // Replace this later with real API

        const apiResponse = [

          {
            id: 1,
            title:
              "AI Research Summary",
            image:
              "https://picsum.photos/400/250?random=1"
          },

          {
            id: 2,
            title:
              "Deep Learning Notes",
            image:
              "https://picsum.photos/400/250?random=2"
          },

          {
            id: 3,
            title:
              "Computer Vision Report",
            image:
              "https://picsum.photos/400/250?random=3"
          },

          {
            id: 4,
            title:
              "Generated Proposal",
            image:
              "https://picsum.photos/400/250?random=4"
          },

          {
            id: 5,
            title:
              "Machine Learning Guide",
            image:
              "https://picsum.photos/400/250?random=5"
          },

          {
            id: 6,
            title:
              "AI Architecture",
            image:
              "https://picsum.photos/400/250?random=6"
          },

          {
            id: 7,
            title:
              "Neural Network Notes",
            image:
              "https://picsum.photos/400/250?random=7"
          },

          {
            id: 8,
            title:
              "Generated Thesis",
            image:
              "https://picsum.photos/400/250?random=8"
          },

          {
            id: 9,
            title:
              "Vision Transformer",
            image:
              "https://picsum.photos/400/250?random=9"
          },

          {
            id: 10,
            title:
              "LLM Architecture",
            image:
              "https://picsum.photos/400/250?random=10"
          }

        ];

        setDocuments(apiResponse);

      } catch (error) {

        console.log(
          "Error fetching data:",
          error
        );
      }
    };

    fetchData();

  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(
    documents.length / cardsPerPage
  );

  const startIndex =
    (currentPage - 1) *
    cardsPerPage;

  const currentCards =
    documents.slice(
      startIndex,
      startIndex + cardsPerPage
    );

  return (

    <div className="min-h-screen bg-base-200 p-4 sm:p-6 mt-10">

      {/* Header */}
      <div className="mb-8">

        <h1 className="text-2xl sm:text-4xl font-bold">
          Blogs
        </h1>

        <p className="text-base-content/70 mt-2">
          Browse AI generated blogs,
          reports, and documents.
        </p>

      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        {currentCards.map((doc) => (

          <div
            key={doc.id}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
          >

            {/* Image */}
            <figure>

              <img
                src={doc.image}
                alt={doc.title}
                className="h-52 w-full object-cover"
              />

            </figure>

            {/* Card Body */}
            <div className="card-body">

              <h2 className="card-title">
                {doc.title}
              </h2>

              <p className="text-sm text-base-content/70">
                AI generated blog preview.
              </p>

              <div className="card-actions justify-end mt-4">

                <button className="btn btn-primary btn-sm sm:btn-md">

                  View Details

                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10">

        <div className="join">

          {/* Previous */}
          <button
            className="join-item btn"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(
                currentPage - 1
              )
            }
          >
            «
          </button>

          {/* Page Numbers */}
          {[...Array(totalPages)].map(
            (_, index) => (

              <button
                key={index}
                className={`join-item btn ${
                  currentPage ===
                  index + 1
                    ? "btn-primary"
                    : ""
                }`}
                onClick={() =>
                  setCurrentPage(
                    index + 1
                  )
                }
              >

                {index + 1}

              </button>
            )
          )}

          {/* Next */}
          <button
            className="join-item btn"
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              setCurrentPage(
                currentPage + 1
              )
            }
          >
            »
          </button>

        </div>

      </div>

    </div>
  );
};

export default Blogs;