import * as d3 from 'd3';
import { ChartDimensions, IdentityData, ProcessedDataPoint, QuadrantLabel } from './types';
import ChartTooltip from './ChartTooltip';

export class D3Chart {
  private svg: d3.Selection<SVGGElement, unknown, null, undefined>;
  private width: number;
  private height: number;
  private xScale: d3.ScaleLinear<number, number>;
  private yScale: d3.ScaleLinear<number, number>;
  private colorScale: d3.ScaleOrdinal<string, string>;
  private lineGroup: d3.Selection<SVGGElement, unknown, null, undefined>;

  constructor(
    container: HTMLDivElement,
    dimensions: ChartDimensions,
    isSecondary: boolean = false
  ) {
    const { width, height, margin } = dimensions;

    this.width = width - margin.left - margin.right;
    this.height = height - margin.top - margin.bottom;

    // Initialize scales
    this.xScale = d3.scaleLinear().domain([-10, 10]).range([0, this.width]);
    this.yScale = d3.scaleLinear().domain([-10, 10]).range([this.height, 0]);
    this.colorScale = d3.scaleOrdinal().range(d3.schemeSet3);

    // Create SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    this.svg = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Initialize line group
    this.lineGroup = this.svg.append('g').attr('class', 'connections');

    this.setupGradients(isSecondary);
    this.setupGrid();
  }

  private setupGradients(isSecondary: boolean): void {
    const defs = this.svg.append('defs');
    const gradient = defs.append('radialGradient')
      .attr('id', `point-gradient-${isSecondary ? 'secondary' : 'primary'}`);

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'white')
      .attr('stop-opacity', 0.4);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'white')
      .attr('stop-opacity', 0);
  }

  private setupGrid(): void {
    // Grid implementation
    const gridPattern = this.svg.append('defs')
      .append('pattern')
      .attr('id', 'grid-pattern')
      .attr('width', 40)
      .attr('height', 40)
      .attr('patternUnits', 'userSpaceOnUse');

    gridPattern.append('path')
      .attr('d', 'M 40 0 L 0 0 0 40')
      .attr('fill', 'none')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 0.5);

    // Add grid background
    this.svg.append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', 'url(#grid-pattern)')
      .style('opacity', 0.2);

    // Add axes
    this.svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${this.height/2})`)
      .call(d3.axisBottom(this.xScale).tickSize(-this.height).tickFormat(() => ''));

    this.svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${this.width/2},0)`)
      .call(d3.axisLeft(this.yScale).tickSize(-this.width).tickFormat(() => ''));
  }

  public updateData(
    data: Record<string, IdentityData>,
    onNodeClick?: (category: string) => void
  ): void {
    const processedData = this.processData(data);
    this.drawPoints(processedData, onNodeClick);
    this.drawLegend(processedData);
  }

  private processData(data: Record<string, IdentityData>): ProcessedDataPoint[] {
    return Object.entries(data).map(([key, value], index) => {
      const angle = (index / Object.keys(data).length) * 2 * Math.PI;
      const radius = 10 - value.Strength;
      return {
        name: key,
        strength: value.Strength,
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
        details: value
      };
    });
  }

  private drawPoints(
    data: ProcessedDataPoint[],
    onNodeClick?: (category: string) => void
  ): void {
    const points = this.svg.selectAll('.point-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'point-group');

    // Add point glow
    points.append('circle')
      .attr('class', 'dot-glow')
      .attr('r', d => (11 - d.strength) * 2)
      .attr('cx', d => this.xScale(d.x))
      .attr('cy', d => this.yScale(d.y))
      .style('fill', d => `url(#point-gradient-primary)`);

    // Add main points
    points.append('circle')
      .attr('class', 'dot')
      .attr('r', d => 11 - d.strength)
      .attr('cx', d => this.xScale(d.x))
      .attr('cy', d => this.yScale(d.y))
      .style('fill', d => this.colorScale(d.name))
      .style('stroke', 'white')
      .style('stroke-width', '2px')
      .style('cursor', 'pointer')
      .on('mouseover', (event, d) => this.handleMouseOver(event, d))
      .on('mouseout', (event, d) => this.handleMouseOut(event, d))
      .on('click', (event, d) => onNodeClick?.(d.name));

    // Add labels
    points.append('text')
      .attr('x', d => this.xScale(d.x))
      .attr('y', d => this.yScale(d.y) - (11 - d.strength) - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#4B5563')
      .style('font-size', '12px')
      .text(d => d.name);
  }

  private handleMouseOver(event: any, d: ProcessedDataPoint): void {
    // Implement hover effects
    d3.select(event.target)
      .transition()
      .duration(200)
      .attr('r', (11 - d.strength) * 1.2);

    // Show connections
    this.showConnections(d);
  }

  private handleMouseOut(event: any, d: ProcessedDataPoint): void {
    d3.select(event.target)
      .transition()
      .duration(200)
      .attr('r', 11 - d.strength);

    this.lineGroup.selectAll('.connection-line').remove();
  }

  private showConnections(d: ProcessedDataPoint): void {
    const centerX = this.xScale(d.x);
    const centerY = this.yScale(d.y);

    this.lineGroup.selectAll('.connection-line')
      .data(this.svg.selectAll('.dot').data().filter((item: any) => item !== d))
      .join('line')
      .attr('class', 'connection-line')
      .attr('x1', centerX)
      .attr('y1', centerY)
      .attr('x2', (item: any) => this.xScale(item.x))
      .attr('y2', (item: any) => this.yScale(item.y))
      .style('stroke', this.colorScale(d.name))
      .style('stroke-width', '1px')
      .style('stroke-opacity', '0.2')
      .style('stroke-dasharray', '4,4');
  }

  private drawLegend(data: ProcessedDataPoint[]): void {
    const legend = this.svg.append('g')
      .attr('transform', `translate(${this.width + 20}, 20)`);

    const legendItems = legend.selectAll('.legend-item')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 25})`);

    legendItems.append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .attr('rx', 4)
      .style('fill', d => this.colorScale(d.name));

    legendItems.append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('fill', '#666')
      .style('font-size', '12px')
      .text(d => d.name);
  }
}