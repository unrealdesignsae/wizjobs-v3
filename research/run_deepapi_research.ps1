param(
  [string]$Timestamp = (Get-Date -Format "yyyyMMdd_HHmmss"),
  [string]$JobId = "all"
)

. "$HOME/.deepapi/env.ps1"
$ErrorActionPreference = "Stop"
$outDir = "D:\UNREAL\CODE\Wizjobs\research"
$base = $env:DEEPAPI_API_BASE_URL.TrimEnd('/')
$ver = "4dbca805b9cf"

$allJobs = @(
  @{
    id = "uae-platforms"
    query = "What are the leading Dubai and UAE job platforms in 2024-2026 (Bayt, Naukrigulf, GulfTalent, LinkedIn UAE, and others)? Compare their strengths, weaknesses, candidate UX, employer tools, mobile experience, pricing/positioning, and gaps for creative-technology talent."
    context = "Research for WizJobs, a Dubai-focused creative-tech job platform with map discovery and an upcoming employer website."
    instructions = "Return a competitive teardown with named products, concrete feature/UX notes, citations, and opportunity gaps WizJobs could own."
  },
  @{
    id = "global-candidate"
    query = "What do best-in-class global candidate job-search products do well in 2024-2026 (LinkedIn, Indeed, Wellfound/AngelList, Otta or Welcome to the Jungle, Handshake, RippleMatch, and similar)? Focus on discovery, matching explainability, application tracking, messaging, personalization, and onboarding UX patterns worth copying or avoiding."
    context = "WizJobs is a candidate-first prototype with daily matches, applications workspace, messages, and saved roles."
    instructions = "Comparative UX/product patterns with evidence. Call out what separates category leaders from clones."
  },
  @{
    id = "creative-tech"
    query = "How do creative, design, 3D, and tech talent platforms win candidates and employers (Behance Jobs, ArtStation Jobs, Dribbble, Creative Circle, Arc.dev, Contra, Working Not Working, YunoJuno, and similar)? What portfolio-first and craft-first UX patterns matter most?"
    context = "WizJobs targets creative-technology professionals (3D, Unreal, technical art, visualization) in Dubai."
    instructions = "Identify must-have niche differentiators vs generic job boards. Include employer hiring-side patterns where relevant."
  },
  @{
    id = "map-ai-companion"
    query = "What product and UX evidence exists for map-based local job discovery, explainable AI job matching, and AI job-search companions/coaches in career products? Which approaches build trust and retention, and which feel gimmicky?"
    context = "WizJobs has a Dubai map Explore experience, match percentages, and a character companion named Wizy."
    instructions = "Best practices, anti-patterns, and recommendations for making map + explainable matches + companion a real moat."
  },
  @{
    id = "employer-side"
    query = "What makes an excellent employer-side job platform or recruiting website in 2025-2026? Cover job posting UX, candidate pipeline/ATS-lite, employer branding, sourcing creative/tech talent, pricing models for two-sided marketplaces, and how top products keep recruiters coming back."
    context = "WizJobs will have an employer website in addition to the candidate app. Early-stage two-sided marketplace."
    instructions = "Playbook for employer MVP vs later features. Cite products and patterns. Flag chicken-and-egg risks and mitigations."
  },
  @{
    id = "best-in-class-playbook"
    query = "For a new two-sided job marketplace focused on Dubai creative-tech talent, with map discovery and an AI companion, what strategic product bets would make it clearly better than LinkedIn, Bayt, and niche creative boards? Include candidate-side and employer-side must-wins, sequencing, and measurable definition of best."
    context = "Synthesize a product excellence playbook for WizJobs before UI fixes begin."
    instructions = "Prioritized playbook: 90-day / 6-month bets, table-stakes vs differentiators, risks, and success metrics. Evidence-backed."
  }
)

$jobs = if ($JobId -eq "all") { $allJobs } else { $allJobs | Where-Object { $_.id -eq $JobId } }
if (-not $jobs -or $jobs.Count -eq 0) { throw "No job matched JobId=$JobId" }

foreach ($job in $jobs) {
  $idKey = [guid]::NewGuid().ToString()
  $headers = @{
    Authorization = "Bearer $($env:DEEPAPI_API_KEY)"
    "Content-Type" = "application/json"
    "X-DeepAPI-Skill-Version" = $ver
    "Idempotency-Key" = $idKey
  }
  $bodyObj = @{
    query = $job.query
    context = $job.context
    instructions = $job.instructions
    maxCostUsd = "1.875"
  }
  $body = $bodyObj | ConvertTo-Json -Compress
  $outFile = Join-Path $outDir ("research_raw_$($job.id)_$Timestamp.json")
  Write-Output "START:$($job.id)"
  try {
    $resp = Invoke-RestMethod -Method Post -Uri "$base/v1/research/deep" -Headers $headers -Body $body -TimeoutSec 900
    $resp | ConvertTo-Json -Depth 40 | Set-Content -Path $outFile -Encoding UTF8
    $comp = if ($resp.output) { $resp.output.completeness } else { "" }
    Write-Output "DONE:$($job.id) status=$($resp.status) completeness=$comp file=$outFile"
  } catch {
    $errFile = Join-Path $outDir ("research_err_$($job.id)_$Timestamp.txt")
    $_ | Out-String | Set-Content -Path $errFile -Encoding UTF8
    Write-Output "FAIL:$($job.id) $($_.Exception.Message)"
    exit 1
  }
}
Write-Output "JOBSET_COMPLETE:$JobId"
