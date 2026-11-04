// C port of gen9.js (same evaluator, same fit, same hill climb). Added: small push toward a word running top to bottom.
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <stdint.h>
#define N 5
#define R 7
#define MAXN 200000
int ch[MAXN][26],nn=1;char isA[MAXN],isC[MAXN],isI[MAXN];
static uint32_t x;static double rr(){x=x*1664525u+1013904223u;return x/4294967296.0;}
char B[R][N];
int stC[MAXN],stA[MAXN],stD[MAXN],stU[MAXN],stF[MAXN],stT[MAXN],tick=0;
typedef struct{int com,dn,up,all,full,land,deadAll,deadCom,exits,vw,deep;}E;
static E e;static char endsF[R][N];
static void rec(int t,int l,int i,int down){
 if(stA[t]!=tick){stA[t]=tick;e.all++;}
 if(isC[t]){if(stC[t]!=tick){stC[t]=tick;e.com++;}
  if(l>=0){}
 }
 endsF[l][i]=1;
}
static void gofull(int t,int len){ if(len==R&&!isI[t]&&isC[t]&&stF[t]!=tick){stF[t]=tick;e.full++;} }
static void walk(int t,int l,int i,int dir,int len){
 t=ch[t][B[l][i]-'A'];if(!t)return;len++;
 if(len>=3&&isA[t]){rec(t,l,i,dir);gofull(t,len);if(isC[t]){if(dir>0){if(stD[t]!=tick){stD[t]=tick;e.dn++;}if(l==R-1&&stT[t]!=tick){stT[t]=tick;e.deep++;}}else{if(stU[t]!=tick){stU[t]=tick;e.up++;}}}}
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
 for(int i=0;i<N;i++){walk(0,0,i,1,0);walk(0,R-1,i,-1,0);}
 for(int l=1;l<R-1;l++)for(int i=0;i<N;i++){if(!endsF[l][i])continue;e.land++;ca=cc=0;
  if(l==1)cnt(0,l,i,1,0);else if(l==R-2)cnt(0,l,i,-1,0);else{cnt(0,l,i,1,0);cnt(0,l,i,-1,0);}
  e.exits+=cc<6?cc:6;if(!ca)e.deadAll++;if(!cc)e.deadCom++;}
 for(int l=0;l<R;l++){int v=0;for(int i=0;i<N;i++)if(strchr("AEIOU",B[l][i]))v++;if(v>N-2)e.vw+=v-(N-2);}
}
static int mn(int a,int b){return a<b?a:b;}
static double fit(){return (e.com<85?(e.com-85)*40:0)+(e.full<4?(e.full-4)*80:0)-e.deadAll*200-e.deadCom*25+e.com+mn(e.dn,e.up)*2+mn(e.full,5)*40+e.land*2+e.exits*3-e.vw*60+(e.deep<1?-80:0);}
const char*L="EEEEEEEAAAAAAOOOOOIIIIIUURRRRRTTTTTSSSSSNNNNLLLLDDDPPCCMMBBGHHKWFY";
int main(int c,char**v){int from=atoi(v[1]),to=atoi(v[2]);long iters=atol(v[3]);FILE*f=fopen("words.txt","r");char w[16];int a,b,d;
 while(fscanf(f,"%15s %d %d",w,&a,&b)==3){int t=0;for(char*p=w;*p;p++){int k=*p-'A';if(!ch[t][k])ch[t][k]=nn++;t=ch[t][k];}isA[t]=1;isC[t]=a;isI[t]=b;}
 int LL=strlen(L);char best[R][N];
 for(int sd=from;sd<to;sd++){x=sd*911u+35*7u+3;
  for(int l=0;l<R;l++)for(int i=0;i<N;i++)for(;;){char ct=L[(int)(rr()*LL)];if((l==0||l==R-1)?(!strchr("AEIOU",ct)||rr()<.2):1){B[l][i]=ct;break;}}
  ev();double cs=fit(),bs=cs;memcpy(best,B,sizeof B);E be=e;
  for(long t=0;t<iters;t++){int q[2][3],m=rr()<.3?2:1;for(int k=0;k<m;k++){int l=(int)(rr()*R),i=(int)(rr()*N);q[k][0]=l;q[k][1]=i;q[k][2]=B[l][i];B[l][i]=L[(int)(rr()*LL)];}
   ev();double s=fit();if(s>=cs||rr()<.003){cs=s;if(s>bs){bs=s;be=e;memcpy(best,B,sizeof B);}}else for(int k=m-1;k>=0;k--)B[q[k][0]][q[k][1]]=q[k][2];}
  printf("%.0f com=%d full=%d deep=%d dn=%d up=%d deadA=%d deadC=%d vw=%d ",bs,be.com,be.full,be.deep,be.dn,be.up,be.deadAll,be.deadCom,be.vw);
  for(int l=0;l<R;l++){fwrite(best[l],1,N,stdout);putchar(l<R-1?' ':'\n');}fflush(stdout);}
}
