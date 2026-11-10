export default function Pager({ page, hasMore, onChange }) {
  return (
    <div className="pager">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Prev
      </button>
      <span>Page {page}</span>
      <button disabled={!hasMore} onClick={() => onChange(page + 1)}>
        Next
      </button>
    </div>
  )
}
