// Importing necessary dependencies and assets
import React, { useState, useEffect } from "react";
import { Meme } from './component/meme';
import image from "./backgroundimg.jpg";
import "./App.css";

// Helper function to convert object to query parameters
const objectToQueryParam = (obj) => {
  const params = Object.entries(obj).map(([key, value]) => `${key}=${value}`);
  return '?' + params.join("&");
};

// Main App component
function App() {
  // State variables
  const [templates, setTemplates] = useState([]);
  const [template, setTemplate] = useState(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [meme, setMeme] = useState(null);

  // Fetch templates on component mount
  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes").then(x =>
      x.json().then(response => setTemplates(response.data.memes))
    );
  }, []);

  // If a meme is available, display it
      if (meme) {
        return (
            
            <img style={{ width: 200}} src={meme} alt="custom meme" />
        );
      }

  // Render the template selection form or meme creation form
  return (
    <div style={{ textAlign: "center" }}>
      {/* Template creation form */}
      {template && (
        <form
          onSubmit={async e => {
            e.preventDefault();
            const params = {
              template_id: template.id,
              text0: topText,
              text1: bottomText,
              username: "akul0105",
              password: "Akul1234"
            };
            const response = await fetch(
              `https://api.imgflip.com/caption_image${objectToQueryParam(
                params
              
              )}`
            );
            const json = await response.json();
            setMeme(json.data.url);
          }}
        >
          <Meme template={template} />
          <input
            placeholder="top text"
            value={topText}
            onChange={e => setTopText(e.target.value)}
          />
          <input
            placeholder="bottom text"
            value={bottomText}
            onChange={e => setBottomText(e.target.value)}
          />
          <button type="submit">Create Meme</button>
        </form>
      )}

      {/* Template selection section */}
      {!template && (

          <div style={{ backgroundImage: `url(${image})` }}>
            <h1 style={{ color: "white" }}>Pick a template</h1>
                <div className="grid-container">          
                        {templates.map(template => (
                          <Meme
                            key={template.id}  // Add key prop to avoid React warning
                            template={template}
                            onClick={() => {
                              setTemplate(template);
                            }}
                          />
                        ))}
            </div>
          </div>
      )}
    </div>
  );
}

export default App;