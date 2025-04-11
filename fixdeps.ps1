
function REPAIR-NPMdeps {
  # .NOTES
  # ONLY USE as last resort when "npm i --force" has failed
  [CmdletBinding()]
  param ()
  begin {
    $pkjf = Resolve-Path $PSScriptRoot/package.json
    $pkjl = Resolve-Path $PSScriptRoot/package-lock.json
  }
  process {
    Remove-Item ./node_modules -Recurse -Force
    Remove-Item $pkjl -Force
    $json = [IO.File]::ReadAllText($pkjf) | ConvertFrom-Json
    $deps = ($json.dependencies | Get-Member -Type NoteProperty | Select-Object -expand Name) -join ' '
    $json.dependencies = @{}
    $json | ConvertTo-Json | Out-File $pkjf
    return [scriptblock]::Create("npm i $deps").Invoke()
  }
}