# Family Todo Web Panel - UI Design System

## 🎨 Design Philosophy
**Clean • Minimal • Professional • Consistent**

Our design focuses on clarity, usability, and a modern aesthetic without unnecessary visual noise.

---

## 📐 Layout Standards

### Container
- **Max Width**: `1400px` for wide content (tables, dashboards)
- **Max Width**: `1200px` for standard content
- **Max Width**: `600px` for forms (Login, Register)
- **Vertical Spacing**: `mt-4 mb-5` (top margin 1.5rem, bottom 5rem)

### Grid System
- **Gap**: `g-3` (1rem gap between columns)
- **Breakpoints**:
  - `xs`: Mobile (< 576px)
  - `sm`: Tablet (≥ 576px)
  - `md`: Small desktop (≥ 768px)
  - `lg`: Desktop (≥ 992px)
  - `xl`: Large desktop (≥ 1200px)

---

## 🎨 Color Palette

### Primary Colors
```css
--primary-blue: #0d6efd;      /* Primary actions, links */
--success-green: #28a745;     /* Success, completed states */
--warning-orange: #fd7e14;    /* Pending, warnings */
--danger-red: #dc3545;        /* Errors, high priority */
--info-cyan: #17a2b8;         /* Info messages */
--dark-gray: #343a40;         /* Headers, text */
--light-gray: #6c757d;        /* Secondary text */
```

### Background Colors
```css
--bg-white: #ffffff;
--bg-light: #f8f9fa;
--bg-lighter: #e9ecef;
--card-shadow: rgba(0, 0, 0, 0.08);
```

### Status Colors
- **Pending**: `#fd7e14` (Orange)
- **In Progress**: `#0d6efd` (Blue)
- **Completed**: `#28a745` (Green)
- **Paid**: `#28a745` (Green)
- **Unpaid**: `#dc3545` (Red)

---

## 📝 Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

### Headings
- **H1**: `2.5rem` (40px), `font-weight: 700`
- **H2**: `2rem` (32px), `font-weight: 700`
- **H3**: `1.5rem` (24px), `font-weight: 600`
- **H4**: `1.25rem` (20px), `font-weight: 600`
- **H5**: `1rem` (16px), `font-weight: 600`

### Body Text
- **Regular**: `1rem` (16px), `font-weight: 400`
- **Small**: `0.875rem` (14px)
- **Tiny**: `0.75rem` (12px)
- **Bold**: `font-weight: 600`

### Text Colors
- **Primary**: `#212529` (dark)
- **Muted**: `#6c757d` (gray)
- **Light**: `#adb5bd` (light gray)

---

## 🖼️ Cards

### Standard Card
```jsx
<Card className="shadow-sm border-0" style={{ borderRadius: '12px' }}>
  <Card.Body className="p-4">
    {/* Content */}
  </Card.Body>
</Card>
```

### Stats Card
```jsx
<Card className="shadow-sm border-0" style={{ borderRadius: '12px', borderLeft: '4px solid #0d6efd' }}>
  <Card.Body className="text-center py-4">
    <h2 style={{ fontWeight: '700', fontSize: '2.5rem' }}>42</h2>
    <small className="text-muted text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
      Label
    </small>
  </Card.Body>
</Card>
```

### Properties
- **Border Radius**: `12px` (rounded corners)
- **Shadow**: `shadow-sm` (subtle)
- **Border**: `border-0` (no border, shadow only)
- **Padding**: `p-4` (1.5rem)

---

## 🔘 Buttons

### Primary Button
```jsx
<Button
  variant="primary"
  style={{
    padding: '0.75rem 1.5rem',
    fontWeight: '600',
    borderRadius: '8px',
    fontSize: '1rem'
  }}
>
  Action
</Button>
```

### Outline Button
```jsx
<Button
  variant="outline-primary"
  style={{
    padding: '0.5rem 1rem',
    fontWeight: '500',
    borderRadius: '8px'
  }}
>
  Action
</Button>
```

### Icon Button (Small)
```jsx
<Button
  variant="outline-primary"
  size="sm"
  style={{ padding: '0.25rem 0.5rem' }}
>
  ✏️
</Button>
```

### Properties
- **NO GRADIENTS** - Solid colors only
- **Border Radius**: `8px`
- **Font Weight**: `600` (primary), `500` (outline)
- **Padding**: Generous (0.75rem vertical minimum)

---

## 🏷️ Badges

### Filter Badge (Clickable)
```jsx
<Badge
  style={{
    cursor: 'pointer',
    padding: '0.6rem 1.2rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    borderRadius: '20px',
    backgroundColor: active ? '#0d6efd' : '#e9ecef',
    color: active ? 'white' : '#6c757d',
    transition: 'all 0.2s'
  }}
>
  Label (5)
</Badge>
```

### Status Badge
```jsx
<Badge bg="success">Completed</Badge>
```

### Properties
- **Border Radius**: `20px` (pill shape for filters)
- **Padding**: `0.6rem 1.2rem` (generous spacing)
- **Font Weight**: `500`
- **Transition**: `all 0.2s` (smooth hover)

---

## 📊 Tables

### Standard Table
```jsx
<div style={{ overflowX: 'auto' }}>
  <Table hover className="mb-0" style={{ minWidth: '800px' }}>
    <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
      <tr>
        <th style={{ padding: '1rem' }}>Column</th>
      </tr>
    </thead>
    <tbody>
      <tr style={{ borderBottom: '1px solid #f1f3f5' }}>
        <td style={{ padding: '1rem' }}>Data</td>
      </tr>
    </tbody>
  </Table>
</div>
```

### Properties
- **Overflow**: Horizontal scroll for responsiveness
- **Min Width**: `800px` (prevents column crushing)
- **Padding**: `1rem` (generous cell padding)
- **Header BG**: `#f8f9fa` (light gray)
- **Header Border**: `2px solid #dee2e6`
- **Row Border**: `1px solid #f1f3f5` (subtle)
- **Hover**: Built-in Bootstrap hover effect

---

## 📝 Forms

### Input Field
```jsx
<Form.Group className="mb-3">
  <Form.Label className="fw-bold" style={{ fontSize: '0.9rem' }}>
    Label
  </Form.Label>
  <Form.Control
    type="text"
    placeholder="Placeholder"
    style={{ borderRadius: '8px', padding: '0.75rem' }}
  />
</Form.Group>
```

### Select Dropdown
```jsx
<Form.Select
  style={{ borderRadius: '8px', padding: '0.75rem' }}
>
  <option>Option</option>
</Form.Select>
```

### Properties
- **Border Radius**: `8px`
- **Padding**: `0.75rem` (generous)
- **Label**: Bold, `0.9rem`
- **Margin Bottom**: `mb-3` (1rem)

---

## 🎭 Modals

### Modal Structure
```jsx
<Modal show={show} onHide={handleClose} size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Title</Modal.Title>
  </Modal.Header>
  <Modal.Body className="p-4">
    {/* Content */}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
    <Button variant="primary">Submit</Button>
  </Modal.Footer>
</Modal>
```

---

## 🎨 Empty States

### Standard Empty State
```jsx
<div className="text-center py-5 px-3">
  <div className="mb-3" style={{ fontSize: '3rem', opacity: 0.15 }}>
    📋
  </div>
  <h5 className="text-muted mb-2">No items found</h5>
  <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
    Helpful message here
  </p>
</div>
```

### Properties
- **Icon Size**: `3rem`
- **Icon Opacity**: `0.15` (very subtle)
- **Padding**: `py-5 px-3`
- **Text**: Muted colors, helpful messages

---

## 🎯 Spacing System

### Margins
- **mb-2**: `0.5rem`
- **mb-3**: `1rem` (default section spacing)
- **mb-4**: `1.5rem`
- **mb-5**: `3rem` (major section spacing)

### Padding
- **p-3**: `1rem`
- **p-4**: `1.5rem` (default card padding)
- **p-5**: `3rem`

### Gap
- **gap-2**: `0.5rem`
- **gap-3**: `1rem` (default grid gap)

---

## 🎨 Component Patterns

### Stats Overview Row
```jsx
<Row className="mb-5 g-3">
  <Col xs={6} lg={3}>
    {/* Stat Card */}
  </Col>
  {/* Repeat */}
</Row>
```

### Filter Bar
```jsx
<Card className="mb-5 shadow-sm border-0" style={{ borderRadius: '12px' }}>
  <Card.Body className="p-4">
    <Row className="align-items-end g-3">
      <Col md={4}>
        {/* Select */}
      </Col>
      <Col md={8}>
        {/* Badges */}
      </Col>
    </Row>
  </Card.Body>
</Card>
```

### Data Table Container
```jsx
<Card className="shadow-sm border-0" style={{ borderRadius: '12px' }}>
  <Card.Body className="p-0">
    {isEmpty ? <EmptyState /> : <TableWithScroll />}
  </Card.Body>
</Card>
```

---

## 🚫 What NOT to Do

❌ **NO gradients on buttons**  
❌ **NO tight spacing** - Be generous  
❌ **NO harsh borders** - Use shadows  
❌ **NO inconsistent border radius**  
❌ **NO generic Bootstrap colors without customization**  
❌ **NO tables without overflow handling**  
❌ **NO large empty state icons** (keep subtle)  

---

## ✅ Checklist for New Pages

- [ ] Container with proper max-width
- [ ] Consistent spacing (mb-5 between sections)
- [ ] Cards with borderRadius: '12px'
- [ ] Shadows instead of borders
- [ ] Generous padding (p-4)
- [ ] Bold, properly sized labels
- [ ] Responsive grid with g-3
- [ ] Table with overflow: 'auto'
- [ ] Proper empty states
- [ ] Status colors consistent
- [ ] No gradients
- [ ] Transitions on interactive elements

---

## 📱 Responsive Guidelines

### Mobile (< 768px)
- Stack cards vertically
- Stats: `xs={6}` (2 per row)
- Filters: Stack vertically
- Tables: Horizontal scroll

### Tablet (768px - 992px)
- Stats: `md={6}` or `md={4}`
- 2-column layouts
- Maintain spacing

### Desktop (≥ 992px)
- Full 3-4 column layouts
- Stats: `lg={3}`
- Optimal spacing

---

## 🎨 Color Usage Guide

### When to Use Each Color

**Primary Blue** (`#0d6efd`):
- Primary action buttons
- "In Progress" status
- Active filters
- Links

**Success Green** (`#28a745`):
- "Completed" status
- "Paid" status
- Success messages
- Positive metrics

**Warning Orange** (`#fd7e14`):
- "Pending" status
- Warnings
- Attention needed

**Danger Red** (`#dc3545`):
- "Unpaid" status
- High priority
- Delete actions
- Errors

**Gray** (`#6c757d`):
- Inactive filters
- Secondary text
- Disabled states

---

## 🔧 Implementation Notes

1. **Always wrap tables** in overflow div
2. **Use formatDate()** utility for all dates
3. **Test on mobile** - ensure horizontal scroll works
4. **Consistent empty states** - same icon size/opacity
5. **Loading states** - show spinners for async operations
6. **Toast notifications** - for all user actions
7. **Form validation** - use validationUtils helpers

---

## 📦 Reusable Components to Create

Future improvements (not yet implemented):
- StatCard component
- FilterBar component
- DataTable component
- EmptyState component
- PageHeader component

---

**Version**: 1.0  
**Last Updated**: 2025-11-20  
**Maintained By**: Development Team
