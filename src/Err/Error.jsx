import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Error = () => {
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    const data = {
      breadcrumb: [
        { name: "Home", link: "/" },
        { name: "HIRE", link: null },
      ],
      title: "404 Error - Page Not Found",
      description:
        "Uh oh, looks like the page you are looking for has moved or no longer exists.",
      searchPlaceholder: "Search...",
      searchButton: "SEARCH",
      searchText: "", // 👈 add initial empty search text
    };

    setPageData(data);
  }, []);

  if (!pageData) {
    return null;
  }

  const handleSearchChange = (e) => {
    setPageData((prev) => ({
      ...prev,
      searchText: e.target.value, // 👈 update search text live
    }));
  };

  const handleSearchSubmit = () => {
    // console.log("Sending to server:", pageData.searchText);
    // here you can POST pageData.searchText to server
  };

  return (
    <div className="max-w-[1370px] mx-auto my-6 p-4 md:p-0">
      <div className="flex items-center gap-2 text-sm mb-4">
        {pageData.breadcrumb.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {item.link ? (
              <Link to={item.link} className="text-[#e62245] hover:underline">
                {item.name}
              </Link>
            ) : (
              <span className="text-[#e62245]">{item.name}</span>
            )}
            {index < pageData.breadcrumb.length - 1 && <span>/</span>}
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl text-gray-700 mb-2">{pageData.title}</h1>
        <p className="mb-6 text-center">{pageData.description}</p>

        <div className="flex w-full mb-16">
          <input
            type="text"
            value={pageData.searchText}
            onChange={handleSearchChange}
            placeholder={pageData.searchPlaceholder}
            className="flex-grow p-2 border border-gray-300 focus:outline-none focus:border-[#e62245]"
          />
          <button
            onClick={handleSearchSubmit}
            className="px-6 bg-red-500 text-white font-semibold rounded-r-md hover:bg-red-600"
          >
            {pageData.searchButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error;
