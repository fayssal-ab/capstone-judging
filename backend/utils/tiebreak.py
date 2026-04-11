from models.score import get_scores_by_team, CRITERIA

def calc_team_averages(team):
    team_id = str(team["_id"])
    scores = get_scores_by_team(team_id)

    if not scores:
        return {c: 0 for c in CRITERIA + ["overall"]}

    avgs = {}
    for c in CRITERIA:
        avgs[c] = round(sum(s[c] for s in scores) / len(scores), 2)
    avgs["overall"] = round(sum(avgs[c] for c in CRITERIA) / len(CRITERIA), 2)
    return avgs

def rank_teams(teams):
    results = []
    for team in teams:
        avgs = calc_team_averages(team)
        results.append({
            "team_id": str(team["_id"]),
            "name": team["name"],
            "company": team["company"],
            **avgs
        })

    # Best Capstone tie-break: overall → originality → ai → scalability
    results.sort(key=lambda x: (
        -x["overall"],
        -x["originality"],
        -x["ai_integration"],
        -x["scalability"]
    ))

    for i, r in enumerate(results):
        r["rank"] = i + 1

    return results

def get_category_winner(teams, category):
    results = []
    for team in teams:
        avgs = calc_team_averages(team)
        results.append({
            "team_id": str(team["_id"]),
            "name": team["name"],
            "company": team["company"],
            "category_avg": avgs[category],
            "overall": avgs["overall"],
            "presentation_clarity": avgs["presentation_clarity"]
        })

    # Category tie-break: category → overall → presentation → jury chair
    results.sort(key=lambda x: (
        -x["category_avg"],
        -x["overall"],
        -x["presentation_clarity"]
    ))

    for i, r in enumerate(results):
        r["rank"] = i + 1

    return results