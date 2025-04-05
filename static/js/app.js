// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log("Metadata:", data.metadata);  //to check the metadata field

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let filteredMetadata = metadata.filter(obj => obj.id == sample)[0];
    console.log("Filtered Metadata:", filteredMetadata); //to check the filtered metadata

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, use d3 to append new tags for each key-value in the filtered metadata.
    Object.entries(filteredMetadata).forEach(([key, value]) => {
      panel.append("h5").text(`${key}: ${value}`);
    });

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log("Samples Data:", data.samples); //to check the samples field
   
    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let filteredSample = samples.filter(obj => obj.id == sample)[0];
    console.log("Filtered Sample:", filteredSample); //to check the filtered sample

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = filteredSample.otu_ids;
    let otu_labels = filteredSample.otu_labels;
    let sample_values = filteredSample.sample_values;

    // Build a Bubble Chart
    let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    };

    // Render the Bubble Chart
    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacteria" },
      hovermode: "closest"
    };
    
    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);
    
    // For the Bar Chart, map the otu_ids to a list of strings for yticks
    let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
   
    // Build a Bar Chart, slice and reverse the input data appropriately
  
    let barTrace = {
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    };

    // Render the Bar Chart
    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Number of Bacteria" },
      
    };

    Plotly.newPlot("bar", [barTrace], barLayout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log("Dataset Names:", data.names); //to check the names field
   
    // Get the names field
    let sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // use d3 to append a new option for each sample name.
    sampleNames.forEach((name) => {
      dropdown.append("option").text(name).property("value", name);
    });

    // Get the first sample from the list
    let firstSample = sampleNames[0];
    console.log("First Sample:", firstSample); //- to check the first sample

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  console.log("New Sample Selected:", newSample); //to check the new sample selected
 
// Build charts and metadata panel each time a new sample is selected
buildMetadata(newSample);
buildCharts(newSample);

}

// Initialize the dashboard
init();
