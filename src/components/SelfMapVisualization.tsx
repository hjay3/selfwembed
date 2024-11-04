import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { X, ChevronLeft, Info } from 'lucide-react';

interface IdentityData {
  Strength: number;
  Title?: string;
  Beliefs?: string;
  Style?: string;
}

interface SelfMapProps {
  data: Record<string, IdentityData>;
}

const generateRelatedData = (originalCategory: string) => {
  const subCategories: Record<string, string[]> = {
    "Creative Expression": [
      "Artistic Projects",
      "Innovation Methods",
      "Creative Process",
      "Inspiration Sources",
      "Artistic Community"
    ],
    "Technical Mastery": [
      "Core Skills",
      "Learning Path",
      "Problem Solving",
      "Technical Tools",
      "Knowledge Sharing"
    ],
    "Community Building": [
      "Network Growth",
      "Engagement",
      "Support Systems",
      "Collaboration",
      "Impact Measurement"
    ],
    "Personal Growth": [
      "Learning Goals",
      "Self-Reflection",
      "Habits",
      "Mindfulness",
      "Future Vision"
    ],
    "Leadership": [
      "Team Building",
      "Vision Setting",
      "Mentorship",
      "Decision Making",
      "Strategic Planning"
    ]
  };

  const data: Record<string, Record<string, any>> = {
    [`${originalCategory} Detail Map`]: {}
  };

  const categories = subCategories[originalCategory] ||
    ["Aspect 1", "Aspect 2", "Aspect 3", "Aspect 4", "Aspect 5"];

  categories.forEach(category => {
    const strength = Math.floor(Math.random() * 4) + 7;
    data[`${originalCategory} Detail Map`][category] = {
      Strength: strength,
      Title: `${category} Specialist`,
      Beliefs: `Mastering ${category.toLowerCase()} leads to excellence`,
      Style: `Focused on ${category.toLowerCase()} development`
    };
  });

  return data;
};

const SelfMapVisualization: React.FC<SelfMapProps> = ({ data }) => {
  const primaryChartRef = useRef<HTMLDivElement>(null);
  const secondaryChartRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const createVisualization = (
    containerRef: React.RefObject<HTMLDivElement>,
    visualData: Record<string, IdentityData>,
    isSecondary = false
  ) => {
    if (!visualData || !containerRef.current) return;

    d3.select(containerRef.current).selectAll("*").remove();

    const margin = { top: 60, right: 160, bottom: 60, left: 60 };
    const width = (isSecondary ? 800 : 900) - margin.left - margin.right;
    const height = (isSecondary ? 600 : 700) - margin.top - margin.bottom;

    const svg = d3.select(containerRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const defs = svg.append("defs");
    const gradient = defs.append("radialGradient")
      .attr("id", `point-gradient-${isSecondary ? 'secondary' : 'primary'}`);

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "white")
      .attr("stop-opacity", 0.4);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "white")
      .attr("stop-opacity", 0);

    const xScale = d3.scaleLinear()
      .domain([-10, 10])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([-10, 10])
      .range([height, 0]);

    const colorScale = d3.scaleOrdinal()
      .range(d3.schemeSet3);

    const makeGrid = () => {
      const gridPattern = defs.append("pattern")
        .attr("id", "grid-pattern")
        .attr("width", 40)
        .attr("height", 40)
        .attr("patternUnits", "userSpaceOnUse");

      gridPattern.append("path")
        .attr("d", "M 40 0 L 0 0 0 40")
        .attr("fill", "none")
        .attr("stroke", "#e5e7eb")
        .attr("stroke-width", 0.5);

      svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "url(#grid-pattern)")
        .style("opacity", 0.2);

      svg.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0, ${height/2})`)
        .call(d3.axisBottom(xScale)
          .tickSize(-height)
          .tickFormat(() => "")
        )
        .style("stroke", "#e5e7eb")
        .style("stroke-opacity", 0.5);

      svg.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(${width/2}, 0)`)
        .call(d3.axisLeft(yScale)
          .tickSize(-width)
          .tickFormat(() => "")
        )
        .style("stroke", "#e5e7eb")
        .style("stroke-opacity", 0.5);
    };

    makeGrid();

    const xAxis = d3.axisBottom(xScale)
      .tickSize(-5)
      .tickPadding(10);
    const yAxis = d3.axisLeft(yScale)
      .tickSize(-5)
      .tickPadding(10);

    svg.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${height/2})`)
      .call(xAxis)
      .style("color", "#4b5563");

    svg.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${width/2}, 0)`)
      .call(yAxis)
      .style("color", "#4b5563");

    const processedData = Object.entries(visualData).map(([key, value]) => ({
      name: key,
      strength: value.Strength,
      details: value
    }));

    const lineGroup = svg.append("g").attr("class", "connections");

    const calculatePosition = (value: number, scale: d3.ScaleLinear<number, number>) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = scale(10 - value);
      return scale(0) + radius * Math.cos(angle);
    };

    const calculateSize = (value: number) => {
      const baseSize = isSecondary ? 6 : 7;
      if (value === 10) return baseSize * 1.8;
      if (value >= 5) return baseSize * 1.4;
      return baseSize;
    };

    const points = svg.selectAll(".dot")
      .data(processedData)
      .enter()
      .append("g")
      .attr("class", "point-group");

    points.append("circle")
      .attr("class", "dot-glow")
      .attr("r", d => calculateSize(d.strength) * 2)
      .attr("cx", d => calculatePosition(d.strength, xScale))
      .attr("cy", d => calculatePosition(d.strength, yScale))
      .style("fill", `url(#point-gradient-${isSecondary ? 'secondary' : 'primary'})`);

    points.append("circle")
      .attr("class", "dot")
      .attr("r", d => calculateSize(d.strength))
      .attr("cx", d => calculatePosition(d.strength, xScale))
      .attr("cy", d => calculatePosition(d.strength, yScale))
      .style("fill", d => colorScale(d.name))
      .style("stroke", "white")
      .style("stroke-width", "2px")
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        const tooltip = d3.select("body")
          .append("div")
          .attr("class", "absolute bg-black bg-opacity-90 text-white p-4 rounded-lg pointer-events-none opacity-0 transition-opacity duration-300 text-sm max-w-xs shadow-lg border border-gray-700");

        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", calculateSize(d.strength) * 1.2);

        const centerX = calculatePosition(d.strength, xScale);
        const centerY = calculatePosition(d.strength, yScale);

        lineGroup.selectAll(".connection-line")
          .data(processedData.filter(item => item !== d))
          .join("line")
          .attr("class", "connection-line")
          .attr("x1", centerX)
          .attr("y1", centerY)
          .attr("x2", item => calculatePosition(item.strength, xScale))
          .attr("y2", item => calculatePosition(item.strength, yScale))
          .style("stroke", colorScale(d.name))
          .style("stroke-width", "1px")
          .style("stroke-opacity", "0.2")
          .style("stroke-dasharray", "4,4");

        tooltip.transition()
          .duration(200)
          .style("opacity", 1);

        tooltip.html(`
          <div class="space-y-2">
            <div class="font-bold text-lg">${d.name}</div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full" style="background: ${colorScale(d.name)}"></div>
              <div>Strength: ${d.strength}/10</div>
            </div>
            ${d.details.Title ? `<div class="text-gray-300">Role: ${d.details.Title}</div>` : ''}
            ${d.details.Beliefs ? `<div class="text-gray-300">Beliefs: ${d.details.Beliefs}</div>` : ''}
            ${d.details.Style ? `<div class="text-gray-300">Style: ${d.details.Style}</div>` : ''}
          </div>
        `)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 10}px`);
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", (d: any) => calculateSize(d.strength));

        lineGroup.selectAll(".connection-line").remove();
        d3.selectAll(".absolute").remove();
      })
      .on("click", function(event, d) {
        if (!isSecondary) {
          setSelectedCategory(d.name);
          const relatedData = generateRelatedData(d.name);
          setTimeout(() => {
            createVisualization(secondaryChartRef, relatedData[Object.keys(relatedData)[0]], true);
          }, 100);
        }
      });

    const legend = svg.append("g")
      .attr("transform", `translate(${width + 20}, 20)`);

    const legendItems = legend.selectAll(".legend-item")
      .data(processedData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 25})`);

    legendItems.append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("rx", 4)
      .style("fill", d => colorScale(d.name));

    legendItems.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("fill", "#666")
      .style("font-size", "12px")
      .text(d => d.name);

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .text(isSecondary ? `${selectedCategory} Details` : "Personal Identity Map");

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2 + 25)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", "#666")
      .text(isSecondary
        ? "Detailed breakdown of selected identity aspect"
        : "Exploring the dimensions of self-identity and personal values"
      );
  };

  useEffect(() => {
    createVisualization(primaryChartRef, data);
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="relative w-full bg-white rounded-lg shadow-lg p-6">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Info size={20} />
        </button>

        {showInfo && (
          <div className="absolute top-14 right-4 w-64 bg-white p-4 rounded-lg shadow-xl border border-gray-200 z-10 text-sm">
            <h3 className="font-bold mb-2">How to Use</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Hover over points to see details</li>
              <li>• Click points to explore sub-categories</li>
              <li>• Points size indicates strength</li>
              <li>• Lines show relationships</li>
            </ul>
          </div>
        )}

        <div ref={primaryChartRef} className="w-full" style={{ minHeight: '700px' }} />
      </div>

      {selectedCategory && (
        <div className="relative w-full bg-white rounded-lg shadow-lg p-6 animate-fadeIn">
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft size={16} />
              Back to Overview
            </button>
          </div>
          <button
            onClick={() => setSelectedCategory(null)}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
          <div ref={secondaryChartRef} className="w-full" style={{ minHeight: '600px' }} />
        </div>
      )}
    </div>
  );
};

export default SelfMapVisualization;