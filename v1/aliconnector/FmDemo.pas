{
  This demo application accompanies the article
  "How to call Delphi code from scripts running in a TWebBrowser" at
  http://www.delphidabbler.com/articles?article=22.

  This unit defines the main form class.

  This code is copyright (c) P D Johnson (www.delphidabbler.com), 2005-2006.

  v1.0 of 2005/05/09 - original version
  v1.1 of 2006/02/11 - changed to use revised container object that implements
                       IDocHostUIHandler.GetExternal
}


{$A8,B-,C+,D+,E-,F-,G+,H+,I+,J-,K-,L+,M-,N+,O+,P+,Q-,R-,S-,T-,U-,V+,W-,X+,Y+,Z1}


unit FmDemo;

interface

uses
  SysUtils, OleCtrls, SHDocVw, Classes, Controls, ComCtrls, Forms,
  UExternalContainer, Menus, dOPCGUI, dOPCIntf, dOPCComn, dOPCDA, dOPC,
  Windows, Messages, Variants, Graphics, Dialogs, StdCtrls, ToolWin;

type
  TfmMain = class(TForm)
    StatusBar1: TStatusBar;
    WebBrowser1: TWebBrowser;
    PageControl1: TPageControl;
    MainMenu1: TMainMenu;
    Connect1: TMenuItem;
    Reload1: TMenuItem;
    TabSheet2: TTabSheet;
    Memo1: TMemo;
    procedure FormShow(Sender: TObject);
    procedure FormHide(Sender: TObject);
    procedure FormCreate(Sender: TObject);
    procedure Reload1Click(Sender: TObject);
    procedure WebBrowser1DocumentComplete(Sender: TObject; const pDisp: IDispatch; var URL: OleVariant);

  private
    fContainer: TExternalContainer;
    procedure MyMessages(var Msg: TMsg; var Handled: Boolean);
  public
  end;

var
  fmMain: TfmMain;

implementation

{$R *.dfm}

uses html;

procedure TfmMain.MyMessages(var Msg: TMsg; var Handled: Boolean);
var
  X, Y: Integer;
  document,
  E: OleVariant;
  s:string;
  ipos:integer;
  action,filename:string;
  name,value:string;
begin
  if (IsDialogMessage(webbrowser1.Handle, Msg) ) then
  begin
    X := LOWORD(Msg.lParam);
    memo1.lines.add(DateTimeToSTr(now())+'new event '+IntToStr(X));
  end;

  if (Msg.message = WM_LBUTTONDOWN) and IsDialogMessage(webbrowser1.Handle, Msg) then
  begin
    X := LOWORD(Msg.lParam);
    Y := HIWORD(Msg.lParam);
    document := webbrowser1.Document;
    E := document.elementFromPoint(X, Y);
    StatusBar1.SimpleText := 'You clicked on:' + E.outerHTML;
    //memo1.Lines.add('You clicked on:' + E.innerHTML);
    //s:=E.outerHTML;
    {
    if E.getAttribute('name')<>null then
    begin
      name:=E.getAttribute('name');
      OPCGroup.OPCItems.ItemIds[name].WriteSync(E.getAttribute('newvalue'));
    end;
    }
    
    {
    if (copy(s,0,5)='<span') then
    begin
      ipos:=pos('itemId',s);
      s:=copy(s,ipos+8,9999);
      ipos:=pos('"',s);
      itemId :=copy(s,0,ipos-1);

      ipos:=pos('action',s);
      s:=copy(s,ipos+8,9999);
      ipos:=pos('"',s);
      action :=copy(s,0,ipos-1);

      ipos:=pos('filename',s);
      s:=copy(s,ipos+10,9999);
      ipos:=pos('"',s);
      filename :=copy(s,0,ipos-1);

      memo1.Lines.add(action+' on '+filename);

      if (action='edit') then loadfileandopen(itemId,filename);
    end;
    }
  end;
  Handled := False;
end;


procedure TfmMain.FormShow(Sender: TObject);
begin
  fContainer := TExternalContainer.Create(WebBrowser1);
//  WebBrowser1.Navigate(ExtractFilePath(ParamStr(0)) + 'Article22.html');
end;

procedure TfmMain.FormHide(Sender: TObject);
begin
  fContainer.Free;
end;

procedure TfmMain.FormCreate(Sender: TObject);
begin
  reload1.Click;
end;

procedure TfmMain.Reload1Click(Sender: TObject);
begin
  webbrowser1.Navigate('localhost/www.alicon.nl/aim/om');
end;

procedure TfmMain.WebBrowser1DocumentComplete(Sender: TObject;
  const pDisp: IDispatch; var URL: OleVariant);
begin
  //callfunction(WebBrowser1,'commservice','1','','');
end;


end.
