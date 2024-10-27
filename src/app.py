# app.py
from dash import Dash, dcc, html, dash_table, Input, Output, State
import pandas as pd
import dash_leaflet as dl
import json
import base64

# Load GeoJSON data for regions
with open('regions.geojson') as f:
    geojson_data = json.load(f)

# Initialize Dash app
app = Dash(__name__)

# Dashboard Layout
app.layout = html.Div([
    html.Center(html.B(html.H1('GeoVitz Dashboard'))),
    html.Hr(),
    dcc.Upload(
        id='upload-data',
        children=html.Button('Upload CSV'),
        multiple=False
    ),
    dash_table.DataTable(
        id='datatable-id',
        columns=[],
        data=[],
        filter_action='native',
        sort_action='native',
        page_size=10,
        style_table={'overflowX': 'auto'},
        style_cell={
            'height': 'auto',
            'minWidth': '150px', 'maxWidth': '200px',
            'whiteSpace': 'normal'
        },
        row_selectable='single',
    ),
    html.Div(id='map-id', style={'margin-top': '20px'}),
    html.Div(id='region-visualizations', style={'margin-top': '20px'})
])

# Callback to parse uploaded CSV data
@app.callback(
    Output('datatable-id', 'columns'),
    Output('datatable-id', 'data'),
    Input('upload-data', 'contents'),
    State('upload-data', 'filename')
)
def update_output(contents, filename):
    if contents is None:
        return [], []

    # Decode the uploaded file
    content_type, content_string = contents.split(',')
    decoded = pd.read_csv(pd.compat.StringIO(base64.b64decode(content_string).decode('utf-8')))

    # Create columns and data for the DataTable
    columns = [{"name": i, "id": i, "deletable": False, "selectable": True} for i in decoded.columns]
    data = decoded.to_dict('records')
    return columns, data

# Callback to update visualizations based on selected row in the DataTable
@app.callback(
    Output('region-visualizations', 'children'),
    Input("datatable-id", "selected_rows"),
    State("datatable-id", "data")
)
def display_visualizations(selected_rows, data):
    if selected_rows is None or len(selected_rows) == 0:
        return html.P("Select a row to display visualizations.")

    selected_row = data[selected_rows[0]]
    region_name = selected_row.get('region_column', 'Unknown Region')  # Replace with actual column name

    # Example visualization for the region
    return html.Div([
        html.H3(f"Visualizations for {region_name}"),
        dcc.Graph(
            figure={
                'data': [
                    {'x': [1, 2, 3], 'y': [4, 1, 2], 'type': 'bar', 'name': 'Example'},
                ],
                'layout': {
                    'title': f"Data for {region_name}",
                    'xaxis': {'title': 'X-axis'},
                    'yaxis': {'title': 'Y-axis'}
                }
            }
        )
    ])

if __name__ == '__main__':
    app.run_server(debug=True)
