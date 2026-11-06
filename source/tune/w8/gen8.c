// 6 x 8 Ledder boards built around one hidden everyday 8-letter word (gen.c adapted, Nov 6 2026).
// Usage: gen8 words8.txt targets.txt from to iters   (targets: one hidden word per line; board k uses line k)
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#define N 6
#define R 8
#define MAXN 300000
int ch[MAXN][26],nn=1;char isA[MAXN],isC[MAXN],isI[MAXN];
static uint32_t x;static double rr(){x=x*1664525u+1013904223u;return x/4294967296.0;}
char B[R][N],FX[R][N];
int stC[MAXN],stA[MAXN],stD[MAXN],stU[MAXN],st8[MAXN],stL[MAXN],tick=0;
typedef struct{int com,dn,up,all,n8,c8,land,deadAll,deadCom,exits,vw,lng;}E;
static E e;static char endsF[R][N];
static void walk(int t,int l,int i,int dir,int len){
 t=ch[t][B[l][i]-'A'];if(!t)return;len++;
 if(len>=3&&isA[t]){
  if(stA[t]!=tick){stA[t]=tick;e.all++;}
  if(len==8&&st8[t]!=tick){st8[t]=tick;e.n8++;if(isC[t]&&!isI[t])e.c8++;}
  if(isC[t]){if(stC[t]!=tick){stC[t]=tick;e.com++;}if(len>=6&&len<8&&!isI[t]&&stL[t]!=tick){stL[t]=tick;e.lng++;}
   if(dir>0){if(stD[t]!=tick){stD[t]=tick;e.dn++;}}else{if(stU[t]!=tick){stU[t]=tick;e.up++;}}}
  endsF[l][i]=1;}
 int nl=l+dir;if(nl<0||nl>=R)return;
 for(int j=i-1;j<=i+1;j++)if(j>=0&&j<N)walk(t,nl,j,dir,len);
}
static int ca,cc;
static void cnt(int t,int l,int i,int dir,int len){
 t=ch[t][B[l][i]-'A'];if(!t)return;len++;
 if(len>=3&&isA[t]){ca++;if(isC[t])cc++;}
 int nl=l+dir;if(nl<0||nl>=R)return;
 for(int j=i-1;j<=i+1;j++)if(j>=0&&j<N)cnt(t,nl,j,dir,len);
}
static void ev(){tick++;memset(&e,0,sizeof e);memset(endsF,0,sizeof endsF);
 for(int l=0;l<R;l++)for(int i=0;i<N;i++){if(l<R-1)walk(0,l,i,1,0);if(l>0)walk(0,l,i,-1,0);}
 for(int l=1;l<R-1;l++)for(int i=0;i<N;i++){if(!endsF[l][i])continue;e.land++;ca=cc=0;
  if(l==1)cnt(0,l,i,1,0);else if(l==R-2)cnt(0,l,i,-1,0);else{cnt(0,l,i,1,0);cnt(0,l,i,-1,0);}
  e.exits+=cc<6?cc:6;if(!ca)e.deadAll++;if(!cc)e.deadCom++;}
 for(int l=0;l<R;l++){int v=0;for(int i=0;i<N;i++)if(strchr("AEIOU",B[l][i]))v++;if(v>N-2)e.vw+=v-(N-2);}
}
static int mn(int a,int b){return a<b?a:b;}
static double fit(){return (e.com<200?(e.com-200)*30:0)-(e.n8-1)*400-e.deadAll*200-e.deadCom*25+e.com*.6+mn(e.dn,e.up)*1.2+e.land*2+e.exits*2+e.lng*4-e.vw*60;}
const char*L="EEEEEEEAAAAAAOOOOOIIIIIUURRRRRTTTTTSSSSSNNNNLLLLDDDPPCCMMBBGHHKWFY";
int main(int c,char**v){FILE*f=fopen(v[1],"r");char w[16];int a,b;
 while(fscanf(f,"%15s %d %d",w,&a,&b)==3){int t=0;for(char*p=w;*p;p++){int k=*p-'A';if(!ch[t][k])ch[t][k]=nn++;t=ch[t][k];}isA[t]=1;isC[t]=a;isI[t]=b;}
 char tg[4000][12];int nt=0;FILE*g=fopen(v[2],"r");while(nt<4000&&fscanf(g,"%11s",tg[nt])==1)nt++;
 int from=atoi(v[3]),to=atoi(v[4]);long iters=atol(v[5]);int LL=strlen(L);char best[R][N];
 for(int sd=from;sd<to&&sd<nt;sd++){x=sd*2654435761u+12345u;
  memset(FX,0,sizeof FX);
  for(int l=0;l<R;l++)for(int i=0;i<N;i++)B[l][i]=L[(int)(rr()*LL)];
  int col=(int)(rr()*N);for(int l=0;l<R;l++){if(l){int d=(int)(rr()*3)-1;if(col+d<0||col+d>=N)d=-d;col+=d;}B[l][col]=tg[sd][l];FX[l][col]=1;}
  ev();double cs=fit(),bs=cs;memcpy(best,B,sizeof B);E be=e;
  for(long t=0;t<iters;t++){int q[2][3],m=rr()<.3?2:1,k=0;for(;k<m;k++){int l,i;do{l=(int)(rr()*R);i=(int)(rr()*N);}while(FX[l][i]);q[k][0]=l;q[k][1]=i;q[k][2]=B[l][i];B[l][i]=L[(int)(rr()*LL)];}
   ev();double s=fit();if(s>=cs||rr()<.003){cs=s;if(s>bs){bs=s;be=e;memcpy(best,B,sizeof B);}}else for(k=m-1;k>=0;k--)B[q[k][0]][q[k][1]]=q[k][2];}
  printf("%.0f %s com=%d n8=%d c8=%d lng=%d dn=%d up=%d deadA=%d deadC=%d vw=%d land=%d ",bs,tg[sd],be.com,be.n8,be.c8,be.lng,be.dn,be.up,be.deadAll,be.deadCom,be.vw,be.land);
  for(int l=0;l<R;l++){fwrite(best[l],1,N,stdout);putchar(l<R-1?' ':'\n');}fflush(stdout);}
}
