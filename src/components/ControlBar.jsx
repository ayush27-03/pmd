export default function ControlBar({ searchTerm, setSearchTerm, sortOption, setSortOption, itemsPerPage, setItemsPerPage, onFilterToggle }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 bg-white shadow mb-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search projects by title, faculty, or keyword..."
        className="border p-2 rounded w-full md:w-1/3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Controls */}
      <div className="flex gap-3">
        {/* Filter Toggle */}
        <button className="bg-gray-200 px-3 py-2 rounded" onClick={onFilterToggle}>
          Filters
        </button>

        {/* Sorting */}
        <select
          className="border p-2 rounded"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="deadline">Deadline (Soonest)</option>
          <option value="datePosted">Date Posted (Newest)</option>
          <option value="title">Project Title (A-Z)</option>
        </select>

        {/* Items Per Page */}
        <select
          className="border p-2 rounded"
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
        >
          <option value={10}>Show 10</option>
          <option value={25}>Show 25</option>
          <option value={50}>Show 50</option>
        </select>
      </div>
    </div>
  );
}
