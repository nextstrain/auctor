import React from "react"; // eslint-disable-line import/no-extraneous-dependencies
import { Container, Leader } from "./styles";
import { version } from "../../package.json";

/**
 * Simple explanatory information for the app
 */
const Header = () => (
  <Container>
    <Leader>
      Auctor is an interactive in-browser editor for <a href="https://nextstrain.github.io/auspice/narratives/introduction">Nextstrain Narratives</a>.
      <p/>
      This is an early prototype - please see the <a href="https://github.com/nextstrain/auctor/blob/master/README.md">README</a> for more information.
      <p/>
      The right hand side of the screen 👉 shows the rendered output of the current narrative slide, while this side allows you to edit the content of that slide.
      <p/>
      {`Version ${version} (prototype)`}
    </Leader>
  </Container>
);
export default Header;

