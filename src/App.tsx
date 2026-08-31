import { useRoutes } from "react-router-dom";
import { Suspense } from "react";
import routes from "virtual:generated-pages-react";
import MenuBar from "./components/_CommonComponents/menubar";
import styled from "@emotion/styled";

function App() {
  const element = useRoutes(routes);

  return (
    <AppLayout>
      <MenuBar />
      <PageContent>
        <Suspense fallback={<p>Loading...</p>}>
          {element}
        </Suspense>
      </PageContent>
    </AppLayout>
  );
}

export default App;

const AppLayout = styled.div`
  display : flex;
  flex-direction : row;

  justify-content : left;
  margin :0px;
  padding : 0px;
`

const PageContent = styled.div`
  display : flex;
  flex-direction : column;

  justify-content : flex-start;
  align-items : left;

  width : 100%;
  margin :24px;

`