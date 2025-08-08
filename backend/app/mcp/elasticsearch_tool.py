"""Simplified MCP-like tool interface for querying Elasticsearch.
In a real MCP server, you'd declare tool schemas. Here we mimic the pattern
so later integration with an MCP framework is straightforward.
"""
from typing import List, Dict
from ..services.search import search_documents

class ElasticsearchQueryTool:
    name = "elasticsearch_query"
    description = "Query indexed documents by natural language string and return top matches."

    def run(self, query: str, size: int = 3) -> List[Dict]:
        return search_documents(query=query, size=size)

# Registry placeholder
TOOLS = {
    ElasticsearchQueryTool.name: ElasticsearchQueryTool()
}
