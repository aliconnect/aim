unit fOpcExpl;

interface

uses
  Windows, Messages, SysUtils, Variants, Classes, Graphics, Controls, Forms,
  Dialogs, StdCtrls, ExtCtrls, ComCtrls, dOPCIntf, dOPCComn, dOPCDA, dOPC,
  ImgList;

type
  TfmOpcExpl = class(TForm)
    Splitter1: TSplitter;
    TreeView1: TTreeView;
    BottomPanel: TPanel;
    Label18: TLabel;
    Label19: TLabel;
    Label20: TLabel;
    Label21: TLabel;
    LServer: TLabel;
    LVersion: TLabel;
    LState: TLabel;
    LInfo: TLabel;
    edOpcItemName: TEdit;
    cbToPlc: TCheckBox;
    ListBox1: TListBox;
    TopPanel: TPanel;
    Label15: TLabel;
    Label16: TLabel;
    Label17: TLabel;
    ServerCombo: TComboBox;
    bConnect: TButton;
    bDisconnect: TButton;
    OPCServer: TdOPCServer;
    ImageList2: TImageList;
    procedure ServerComboDropDown(Sender: TObject);
    procedure bConnectClick(Sender: TObject);
    procedure bDisconnectClick(Sender: TObject);
    procedure TreeView1Change(Sender: TObject; Node: TTreeNode);
    procedure ShowLeafsInListBox(Folder: TdOPCBrowseItem);
    procedure ListBox1Click(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

var
  fmOpcExpl: TfmOpcExpl;

implementation

{$R *.dfm}

procedure BranchesToTreeView(Browser: TdOPCBrowser; Tree: TTreeView; Node : TTreeNode = nil);
var
  i       : integer;
  S       : TdOPCBrowseItems;
  NewNode : TTreeNode;
  Folder  : TdOPCBrowseItem;
begin
  if Node = nil then                //  if root folder
  begin
    Browser.MovetoRoot;
    Node := Tree.Items.AddChild(nil,'Root');
    Folder  := TdOPCBrowseItem.Create;
    Folder.Assign(Browser.CurrentPosition);
    Node.Data := Folder;
  end;
  Browser.ShowBranches;            // get all Branches in this level from OPC Server
  S := TdOPCBrowseItems.Create;
  S.Assign(Browser.Items);         // save Items in new StringList
  for i := 0 to S.Count-1 do       // for all Items in stringlist
  begin
      NewNode := Tree.Items.AddChild(Node,S[i].Name);
      Folder  := TdOPCBrowseItem.Create;
      Folder.Assign(S[i]);
      NewNode.Data := Folder;
      if assigned(Tree.Images) then                // only for selected images
        if Tree.Images.Count > 1 then
          NewNode.SelectedIndex := 1;
      if Browser.MoveDown(S.Items[i]) then               // one Level down
      begin
        BranchesToTreeView(Browser,Tree,NewNode);  // rekusive call
        Browser.MoveUp;                            // back to old Level
      end;
  end;
  S.Free;
end;


procedure TfmOpcExpl.ServerComboDropDown(Sender: TObject);
begin
  if trim(ServerCombo.Items.Text) = '' then  // if no OPC Servernames loaded
  begin
    Screen.Cursor := crHourGlass;
    GetOPCDAServers(ServerCombo.Items);        // get Servernames from registry
    Screen.Cursor := crDefault;
  end;
end;

procedure TfmOpcExpl.bConnectClick(Sender: TObject);
var
  State : tServerStateRec;
begin
   OpcServer.Active     := false;              // disconnect from old server
   OpcServer.ServerName := ServerCombo.Text;   // set Servername from Combobox
   OpcServer.Active     := true;               // connect to Server

  State := OPCServer.GetState;
  LServer.Caption  := OpcServer.Servername;
  LState.Caption   := State.StatusInfo;
  LInfo.Caption    := State.VendorInfo;
  LVersion.Caption := State.Version + '  ' + OpcServer.ServerTypeName;

  BranchesToTreeView(OpcServer.Browser,TreeView1); // get all Pathes from OPC Server
  if TreeView1.Items.Count > 0 then
  begin
    TreeView1.Items[0].Selected := true;
    TreeView1.Items[0].Expanded := true;
  end;
end;

procedure TfmOpcExpl.bDisconnectClick(Sender: TObject);
begin
  OpcServer.Active     := false;              // disconnect from old server
end;

procedure TfmOpcExpl.TreeView1Change(Sender: TObject; Node: TTreeNode);
begin
  if (Node = nil) or (Node.Data = nil) then
    exit;
  if OPCServer.Active then    // only if connected to opc server
    ShowLeafsInListBox(TdOPCBrowseItem(Node.Data));  // if Tree change then show leafs in Path
end;

procedure TfmOpcExpl.ShowLeafsInListBox(Folder: TdOPCBrowseItem);
var
  i: integer;
begin
  OpcServer.Browser.MoveTo(Folder);               // Move to given Folder
  OpcServer.Browser.ShowLeafs;                    // get all Items from Folder
  ListBox1.Clear;
  ListBox1.Items.BeginUpdate;
  for i := 0 to OpcServer.Browser.Items.Count -1 do
  begin
     //ListBox1.Items.Add(OpcServer.Browser.Items[i].Name); // show items in listbox
     ListBox1.Items.Add(OpcServer.Browser.Items[i].itemId); // show items in listbox
  end;
  ListBox1.Items.EndUpdate;
end;


procedure TfmOpcExpl.ListBox1Click(Sender: TObject);
begin
  edOpcItemName.Text:=ListBox1.Items[ListBox1.ItemIndex];
end;

end.
