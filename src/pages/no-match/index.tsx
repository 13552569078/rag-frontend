import { Link } from "react-router-dom";

const NoMatch: React.FC = () => {
  return (
    <div>
      <h2>页面丢失了</h2>
      <p>
        <Link to="/">返回首页</Link>
      </p>
    </div>
  );
};

export default NoMatch;
