import { Graph } from '@antv/x6';

// Stock: Blue rectangle with thick border
Graph.registerNode('sd:stock', {
  inherit: 'rect',
  width: 150,
  height: 60,
  attrs: {
    body: {
      fill: '#dbeafe',
      stroke: '#3b82f6',
      strokeWidth: 2.5,
      rx: 6,
      ry: 6
    },
    label: {
      fill: '#1e40af',
      fontSize: 15,
      fontWeight: 'bold',
      textAnchor: 'middle',
      textVerticalAnchor: 'middle'
    }
  },
  ports: {
    groups: {
      top: { position: 'top', attrs: { circle: { r: 6, magnet: true, stroke: '#3b82f6', fill: '#fff', strokeWidth: 2 } } },
      bottom: { position: 'bottom', attrs: { circle: { r: 6, magnet: true, stroke: '#3b82f6', fill: '#fff', strokeWidth: 2 } } },
      left: { position: 'left', attrs: { circle: { r: 6, magnet: true, stroke: '#3b82f6', fill: '#fff', strokeWidth: 2 } } },
      right: { position: 'right', attrs: { circle: { r: 6, magnet: true, stroke: '#3b82f6', fill: '#fff', strokeWidth: 2 } } }
    }
  }
});

// Variable: Orange ellipse
Graph.registerNode('sd:variable', {
  inherit: 'ellipse',
  width: 130,
  height: 60,
  attrs: {
    body: {
      fill: '#fef3c7',
      stroke: '#f59e0b',
      strokeWidth: 1.5
    },
    label: {
      fill: '#92400e',
      fontSize: 14,
      textAnchor: 'middle',
      textVerticalAnchor: 'middle'
    }
  },
  ports: {
    groups: {
      top: { position: 'top', attrs: { circle: { r: 6, magnet: true, stroke: '#f59e0b', fill: '#fff', strokeWidth: 2 } } },
      bottom: { position: 'bottom', attrs: { circle: { r: 6, magnet: true, stroke: '#f59e0b', fill: '#fff', strokeWidth: 2 } } },
      left: { position: 'left', attrs: { circle: { r: 6, magnet: true, stroke: '#f59e0b', fill: '#fff', strokeWidth: 2 } } },
      right: { position: 'right', attrs: { circle: { r: 6, magnet: true, stroke: '#f59e0b', fill: '#fff', strokeWidth: 2 } } }
    }
  }
});

// Intervariable: Teal ellipse
Graph.registerNode('sd:intervariable', {
  inherit: 'ellipse',
  width: 130,
  height: 60,
  attrs: {
    body: {
      fill: '#ccfbf1',
      stroke: '#14b8a6',
      strokeWidth: 1.5
    },
    label: {
      fill: '#115e59',
      fontSize: 14,
      textAnchor: 'middle',
      textVerticalAnchor: 'middle'
    }
  },
  ports: {
    groups: {
      top: { position: 'top', attrs: { circle: { r: 6, magnet: true, stroke: '#14b8a6', fill: '#fff', strokeWidth: 2 } } },
      bottom: { position: 'bottom', attrs: { circle: { r: 6, magnet: true, stroke: '#14b8a6', fill: '#fff', strokeWidth: 2 } } },
      left: { position: 'left', attrs: { circle: { r: 6, magnet: true, stroke: '#14b8a6', fill: '#fff', strokeWidth: 2 } } },
      right: { position: 'right', attrs: { circle: { r: 6, magnet: true, stroke: '#14b8a6', fill: '#fff', strokeWidth: 2 } } }
    }
  }
});

// Converter: Purple dashed ellipse
Graph.registerNode('sd:converter', {
  inherit: 'ellipse',
  width: 120,
  height: 70,
  attrs: {
    body: {
      fill: '#ede9fe',
      stroke: '#8b5cf6',
      strokeWidth: 1.5,
      strokeDasharray: '4,2'
    },
    label: {
      fill: '#5b21b6',
      fontSize: 14,
      textAnchor: 'middle',
      textVerticalAnchor: 'middle'
    }
  },
  ports: {
    groups: {
      top: { position: 'top', attrs: { circle: { r: 6, magnet: true, stroke: '#8b5cf6', fill: '#fff', strokeWidth: 2 } } },
      bottom: { position: 'bottom', attrs: { circle: { r: 6, magnet: true, stroke: '#8b5cf6', fill: '#fff', strokeWidth: 2 } } },
      left: { position: 'left', attrs: { circle: { r: 6, magnet: true, stroke: '#8b5cf6', fill: '#fff', strokeWidth: 2 } } },
      right: { position: 'right', attrs: { circle: { r: 6, magnet: true, stroke: '#8b5cf6', fill: '#fff', strokeWidth: 2 } } }
    }
  }
});

// State: Green pill/capsule
Graph.registerNode('sd:state', {
  inherit: 'rect',
  width: 130,
  height: 50,
  attrs: {
    body: {
      fill: '#d1fae5',
      stroke: '#10b981',
      strokeWidth: 2,
      rx: 25,
      ry: 25
    },
    label: {
      fill: '#065f46',
      fontSize: 14,
      textAnchor: 'middle',
      textVerticalAnchor: 'middle'
    }
  },
  ports: {
    groups: {
      top: { position: 'top', attrs: { circle: { r: 6, magnet: true, stroke: '#10b981', fill: '#fff', strokeWidth: 2 } } },
      bottom: { position: 'bottom', attrs: { circle: { r: 6, magnet: true, stroke: '#10b981', fill: '#fff', strokeWidth: 2 } } },
      left: { position: 'left', attrs: { circle: { r: 6, magnet: true, stroke: '#10b981', fill: '#fff', strokeWidth: 2 } } },
      right: { position: 'right', attrs: { circle: { r: 6, magnet: true, stroke: '#10b981', fill: '#fff', strokeWidth: 2 } } }
    }
  }
});

// Cloud/Source node: small gray shape for flow source/sink
Graph.registerNode('sd:cloud', {
  inherit: 'ellipse',
  width: 30,
  height: 22,
  attrs: {
    body: {
      fill: '#e5e7eb',
      stroke: '#9ca3af',
      strokeWidth: 1.5,
    },
    label: {
      fill: '#9ca3af',
      fontSize: 10,
      text: '☁',
    }
  },
  ports: {
    groups: {
      top: { position: 'top', attrs: { circle: { r: 4, magnet: true, stroke: '#9ca3af', fill: '#fff', strokeWidth: 1 } } },
      bottom: { position: 'bottom', attrs: { circle: { r: 4, magnet: true, stroke: '#9ca3af', fill: '#fff', strokeWidth: 1 } } },
      left: { position: 'left', attrs: { circle: { r: 4, magnet: true, stroke: '#9ca3af', fill: '#fff', strokeWidth: 1 } } },
      right: { position: 'right', attrs: { circle: { r: 4, magnet: true, stroke: '#9ca3af', fill: '#fff', strokeWidth: 1 } } }
    },
    items: [
      { group: 'top', id: 'top' },
      { group: 'bottom', id: 'bottom' },
      { group: 'left', id: 'left' },
      { group: 'right', id: 'right' }
    ]
  }
});

// Flow edge: solid blue with bold arrow, smooth curve
Graph.registerEdge('sd:flow', {
  inherit: 'edge',
  connector: { name: 'smooth' },
  attrs: {
    line: {
      stroke: '#3b82f6',
      strokeWidth: 2.5,
      targetMarker: {
        name: 'block',
        width: 14,
        height: 10
      }
    }
  },
  labels: [
    {
      position: 0.5,
      attrs: {
        label: {
          fill: '#1e2433',
          fontSize: 13,
          textAnchor: 'middle',
          textVerticalAnchor: 'bottom'
        },
        rect: {
          fill: '#fff',
          fillOpacity: 0.9,
          stroke: 'none',
          refWidth: 1,
          refHeight: 1,
          refX: -0.05,
          refY: -0.1
        }
      }
    }
  ]
});

// Link edge: dashed gray with thin arrow, smooth curve
Graph.registerEdge('sd:link', {
  inherit: 'edge',
  connector: { name: 'smooth' },
  attrs: {
    line: {
      stroke: '#9ca3af',
      strokeWidth: 2,
      strokeDasharray: '6,4',
      targetMarker: {
        name: 'classic',
        width: 10,
        height: 8
      }
    }
  }
});

console.log('SD custom shapes registered');
