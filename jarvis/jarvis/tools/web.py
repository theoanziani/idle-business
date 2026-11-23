from jarvis.tools import tool


@tool()
def recherche_web(requete: str) -> str:
    """Recherche sur Internet et renvoie les meilleurs résultats.

    Args:
      requete: la recherche
    """
    from ddgs import DDGS
    hits = DDGS().text(requete, region="fr-fr", max_results=5)
    return "\n".join(f"- {h['title']} : {h['body']} ({h['href']})" for h in hits) or "Aucun résultat"
