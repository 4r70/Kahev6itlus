const ResetIcon = ({
  staticColor,
  width = 24,
  height = 24,
  className = "",
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 -960 960 960"
    fill="#fff"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M393-132q-103-29-168-113.5T160-440q0-57 19-108.5t54-94.5q11-12 27-12.5t29 12.5q11 11 11.5 27T290-586q-24 31-37 68t-13 78q0 81 47.5 144.5T410-209q13 4 21.5 15t8.5 24q0 20-14 31.5t-33 6.5Zm174 0q-19 5-33-7t-14-32q0-12 8.5-23t21.5-15q75-24 122.5-87T720-440q0-100-70-170t-170-70h-3l16 16q11 11 11 28t-11 28q-11 11-28 11t-28-11l-84-84q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l84-84q11-11 28-11t28 11q11 11 11 28t-11 28l-16 16h3q134 0 227 93t93 227q0 109-65 194T567-132Z"
      fill={staticColor ? staticColor : "#fff"}
    />
  </svg>
);

export default ResetIcon;
