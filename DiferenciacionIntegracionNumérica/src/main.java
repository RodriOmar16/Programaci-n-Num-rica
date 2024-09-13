import Metodos.Funcion;

public class main {
	
	public static double listaPtos[][];
	
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Funcion f = new Funcion();
		f.setFuncion("x/((x^2)+1)");
		/*System.out.println("funcion: "+f.getFuncion());
		f.evaluar(1.15);
		System.out.println("f("+0+"): "+f.getResultadoFuncion());*/
		//System.out.println("f'(x) aprox.: "+derivadaProgresiva(f, 0.6, 0.1));
		/*double x0 = 1.4142135623731, h = 0.2; int m = 2;
		System.out.println("La derivada por Richardson: "+richardson(f, x0, h, m));*/
		
		double i; 
		/*i = trapecio(f,0,2,1);
		System.out.println("Trapecio: "+i);*/
		
		/*i = simpson(f,0,2,2);
		System.out.println("Trapecio: "+i);*/
		i = richardsonRomberg(f,0,2,4,1);
		System.out.println("RR: "+i);
		
	}
	
	public static double derivadaProgresiva(Funcion f,double x0, double h) {
		double fx0 = f.evaluar2(x0), fx0h = f.evaluar2(x0 + h);
		return ((fx0h - fx0)/h);
	}
	public static double derivadaRegresiva(Funcion f,double x0, double h) {
		double fx0 = f.evaluar2(x0), fx0h = f.evaluar2(x0 + h);
		return ((fx0 - fx0h)/h);
	}
	public static double derivadaCentrada(Funcion f,double x0, double h) {
		double fx0hN = f.evaluar2(x0 - h), fx0h = f.evaluar2(x0 + h);
		return ((fx0h - fx0hN)/(2*h));
	}
	public static double richardson(Funcion f, double x0, double h, int m) {
		double D[][] = new double[m+1][m+1];
		
		D[0][0] = derivadaCentrada(f,x0,h);
		for(int n=1; n<=m ;n++) {
			D[n][0] = derivadaCentrada(f,x0, (h/Math.pow(2, n)));
			
			for(int k=1; k<=n ;k++) {
				D[n][k] = D[n][k-1] + (D[n][k-1] - D[n-1][k-1])/((Math.pow(4, k))-1);
			}
		}
		return D[m][m];
	}
	
	public static double calcularH(double a, double b, int n, int m) {
		return ((b-a)/(n*m));
	}
	public static void determinarListaPuntos(Funcion f, double a, double b, double h, int n, int m) {
		int N = (n*m)+1;
		listaPtos = new double[N][2];
		double acu = a;
		listaPtos[0][0] = a;		listaPtos[0][1] = f.evaluar2(a);
		listaPtos[N-1][0] = b;		listaPtos[N-1][1] = f.evaluar2(b);
		
		for(int i=1; i<(N-1) ;i++) {
			acu += h;
			listaPtos[i][0] = acu;		listaPtos[i][1] = f.evaluar2(acu);
		}
	}
	
	private static void mostrarListaPtos(int n) {
		System.out.println("Mostrar lista de puntos:");
		for(int i=0; i<n ;i++) {
			System.out.println("----------");
			for(int j=0; j<2 ;j++) {
				if(j==1) {
					System.out.println(listaPtos[i][j]);
				}else System.out.print(listaPtos[i][j]+" | ");
			}
		}
	}
	
	public static double trapecio(Funcion f, double a, double b, int veces) {
		double h = calcularH(a, b, 1,veces), acu;
		System.out.println("h: "+h);
		
		determinarListaPuntos(f, a, b, h, 1, veces);
		
		mostrarListaPtos(veces+1);
		
		acu = 0;
		
		for(int i=1; i<veces ;i++) {
			acu += listaPtos[i][1];
		}
		
		return (((h/2)*(listaPtos[0][1]+listaPtos[veces][1]))+(h*acu));
	}
	
	public static double simpson(Funcion f, double a, double b, int veces) {
		double h = calcularH(a, b, 2,veces), acu, acu2;
		System.out.println("h: "+h);
		
		determinarListaPuntos(f, a, b, h, 2, veces);
		
		mostrarListaPtos((2*veces)+1);
		
		acu2 = 0;
		for(int i=1; i<2*veces ;i++) {
			if(i%2!=0) {
				acu2 += listaPtos[i][1];	
			}
		}		
		
		acu = 0;
		for(int i=1; i<(2*veces)-1 ;i++) {
			if(i%2==0) {
				acu += listaPtos[i][1];
			}
		}
		
		
		return ((h/3)*(listaPtos[0][1] + listaPtos[veces*2][1] + 4*acu2 + 2*acu));
	}
	
	public static double richardsonRomberg(Funcion f, double a, double b, int m, int metodo) {
		double D[][] = new double[m+1][m+1];
		
		D[0][0] = metodo == 1 ? trapecio(f,a,b,1) : simpson(f,a,b,1) ; 
		
		for(int n=1; n<=m ;n++) {
			D[n][0] = metodo == 1 ? trapecio(f,a,b,(int)Math.pow(2, n)) : simpson(f,a,b,(int)Math.pow(2, n)) ; 
			
			for(int k=1; k<=n ;k++) {
				D[n][k] = D[n][k-1] + (D[n][k-1] - D[n-1][k-1])/((Math.pow(4, (metodo == 1 ? k : (k+1))))-1);
			}
		}
		return D[m][m];
	}
}
