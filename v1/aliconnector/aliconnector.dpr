{
  This demo application accompanies the article
    "How to call Delphi code from scripts running in a TWebBrowser"
  at
    http://www.delphidabbler.com/articles.php?article=22

  This is the main project file.

  This code is copyright (c) P D Johnson (www.delphidabbler.com), 2005.
}


{$A8,B-,C+,D+,E-,F-,G+,H+,I+,J-,K-,L+,M-,N+,O+,P+,Q-,R-,S-,T-,U-,V+,W-,X+,Y+,Z1}


program aliconnector;


uses
  Forms,
  fAimBrowser in 'fAimBrowser.pas' {fmMain},
  UExternalContainer in 'UExternalContainer.pas',
  UMyExternal in 'UMyExternal.pas',
  IntfDocHostUIHandler in 'IntfDocHostUIHandler.pas',
  UNulContainer in 'UNulContainer.pas',
  AimBrowser_TLB in 'AimBrowser_TLB.pas',
  fCommService in 'fCommService.pas' {fmAIMOPC};

{$R *.tlb}
{$R *.res}

begin
  Application.Initialize;
  Application.Title := 'Aliconnector';
  Application.CreateForm(TfmMain, fmMain);
  //Application.CreateForm(TfmAIMOPC, fmAIMOPC);
  Application.Run;
end.
