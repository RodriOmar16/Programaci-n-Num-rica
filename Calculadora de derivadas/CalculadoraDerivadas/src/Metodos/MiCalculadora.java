package Metodos;

import calculadora.Derivadas;

public class MiCalculadora {
	public static double[][] matriz = new double[100][4];
	public static int n = 0, m = 0;
	
	public static void main(String[] args) throws Exception {
		String expresion = "x-cos(x)"; //(10*(e^(x/2)))*cos(2*x)-4 //(e^(-x))-(3*(x^2))//sin(x)/(x-2)//(x-1)^2//(e^x)-(x^2)+1
		//1/((3*sin(x))-x)//(1+sin(x))/x
	        
        Funcion funcion = new Funcion();
        funcion.setFuncion(expresion);
        double a = 0, b = 1, epsilon = 0.000001, c;
        System.out.println("funcion: "+funcion.getFuncion());
        
        
        //Biseccion
        /*c = biseccion(funcion, a, b, epsilon);
        System.out.println("Bisección: "+ c);*/
        //Regula Falsi
        /*c = regulaFalsi(funcion, a, b, epsilon);
        System.out.println("Regula Falsi: "+ c);*/
        //Regula Falsi Modificada
        /*c = regulaFalsiModificada(funcion, a, b, epsilon);
        System.out.println("Regula Falsi Modificada: "+ c);*/
        //Secante
        /*c = secante(funcion, a, b, epsilon);
        System.out.println("secante: "+ c);*/
        //Newton-Raphson
        /*c=newtonRaphson(funcion,a,epsilon);
        System.out.println("Newton-Raphson: "+c);*/
        //Punto Fijo
        /*c = puntoFijo(epsilon);
        System.out.println("\nPto. fijo: "+c);*/
        //Aiken
        /*c = aitken(epsilon);
        System.out.println("\nAitken: "+c);*/
        //Iterativo convergencia Cúbica
        /*c = convergenciaCubica(funcion,-1,epsilon);
        System.out.println("\nProceso iterativo de 3er Orden:: "+c);*/
        //Steffensen
        
        
	}

	private static double convergenciaCubica(Funcion f, double a, double epsilon) {
		//f'
		Derivadas f_prima = new Derivadas();
		f_prima.setFuncionADerivar(f.getFuncion());
		f_prima.derivar();
        
        Funcion f_derivada_1 = new Funcion();
        f_derivada_1.setFuncion(f_prima.getFuncionDerivada());
        String cad_f_derivada_1 = f_derivada_1.getFuncion();
        System.out.println("f'(x): "+cad_f_derivada_1);
        
        //f''
        Derivadas f_segunda = new Derivadas();
        f_segunda.setFuncionADerivar(cad_f_derivada_1);
        f_segunda.derivar();
        String f_derivada_segunda = f_segunda.getFuncionDerivada();
        
        Funcion f_2da = new Funcion();
        f_2da.setFuncion(f_derivada_segunda);
        System.out.println("f''(x): "+f_2da.getFuncion());
        
        double xn, xn1=a, fxn, fpxn, fpsxn;
        
        do {
        	xn = xn1;
        	System.out.println("xn: "+xn);
        	f.evaluar(xn);
        	fxn = f.getResultadoFuncion();
        	
        	f_derivada_1.evaluar(xn);
        	fpxn = f_derivada_1.getResultadoFuncion();
        	
        	f_2da.evaluar(xn);
        	fpsxn = f_2da.getResultadoFuncion();
        	
        	xn1 = xn - (2*fxn*fpxn)/((2*Math.pow(fpxn, 2))-(fxn * fpsxn));
        	System.out.println("xn1: "+xn1);
        	
        }while(Math.abs(xn1 - xn)>epsilon);
        
		return xn1;
	}

	private static double aitken(double epsilon) {
		int i = 0,j,k;
		double an=100, an1 = 0;
		do {
			an = an1;
			j = i + 1;
			k = i + 2;
			an1 = matriz[i][3] - (Math.pow(matriz[j][3] - matriz[i][3],2)/(matriz[k][3]-2*matriz[j][3]+matriz[i][3]));
			System.out.println("an1: "+ an1);
			i++;
		}while(i < (n-2) && Math.abs(an1- an) > epsilon);
		System.out.println("an1: "+ an1);
		return an1;
	}
	
	private static double puntoFijo(double  epsilon) {
		n = 0; m = 0;
		String expresion = "(x)^(1/3)"; //((3*(x^2))+3)^(1/4)//1/((3*sin(x)-x))//(1+sin(x))/x//(sin(x)/(x+1))+1//e^((1/x)+1)
		
		Funcion g = new Funcion();
		g.setFuncion(expresion);
		double xi, xiMas1 = -2; //valor inicial
		int i = 0;
		do {
			xi = xiMas1;
			System.out.println("i: "+i+"	xi: "+xi);
		
			g.evaluar(xi);
			xiMas1 = g.getResultadoFuncion();
			
			matriz[n][m] = i; m++;
			matriz[n][m] = xi; m++;
			m++;
			matriz[n][m] = xiMas1; m++;
			i++; m=0; n++;
		}while(Math.abs(xiMas1 - xi) > epsilon && i < 100);
		System.out.println("i: "+i+"	xi: "+xi);
		return xiMas1;
	}
	
	private static double newtonRaphson(Funcion f, double valInicial, double epsilon) {
		
        double xn, xMas1 = valInicial;
        int i = 0;
        
        System.out.println("f(x): "+f.getFuncion());
        
        Derivadas derivada = new Derivadas();
        derivada.setFuncionADerivar(f.getFuncion());
        derivada.derivar();
        String f_derivada = derivada.getFuncionDerivada();
        
        Funcion funcion_derivada = new Funcion();
        funcion_derivada.setFuncion(f_derivada);
        System.out.println("f'(x): "+funcion_derivada.getFuncion());
        
        System.out.println();
        double fxn, fDerivadaXn;
        boolean derivadaCero = false;
        
        do{
        	System.out.println("i: "+i+"	"+xMas1);
    		xn = xMas1; i++;
        	
        	f.evaluar(xn);
        	fxn = f.getResultadoFuncion();
        	
        	funcion_derivada.evaluar(xn);
        	fDerivadaXn = funcion_derivada.getResultadoFuncion();
        	
        	if(fDerivadaXn != 0.0) {
        		xMas1 = xn - (fxn/fDerivadaXn);
        	}else derivadaCero = true;
        }while(Math.abs(xMas1 - xn) > epsilon && !derivadaCero);
        
        if(!derivadaCero){
        	System.out.println("i: "+i+"	"+xMas1);
        }else System.out.println("NO se admite derivada = 0 en el algoritmo.");
        return xMas1;
	}
	
	private static double secante(Funcion funcion, double a, double b, double epsilon) {
		int t = 6; n = 0; m = 0;
		double x0 = a , x1 = b, xMas1 = b*2;
		
		funcion.evaluar(x0); 
		double  fx0 = funcion.getResultadoFuncion();
		
		funcion.evaluar(x1); 
		double  fx1 = funcion.getResultadoFuncion();
		
		matriz[n][m] = n;	m++;
		matriz[n][m] = x0; 	m++;
		matriz[n][m] = x1; 	m++;	
		matriz[n][m] = xMas1; 	n++;
		
		int i=0;
		
		while(Math.abs(x1-x0) > epsilon/* && i<t*/) {
			xMas1 = (x0*fx1 - x1*fx0)/(fx1 - fx0);
			
			m = 0;
			matriz[n][m] = n;	m++;
			matriz[n][m] = x0; 	m++;
			matriz[n][m] = x1; 	m++;	
			matriz[n][m] = xMas1; 	n++;
			
			x0 = x1;
			funcion.evaluar(x0); 
			fx0 = funcion.getResultadoFuncion();
			
			x1 = xMas1;
			funcion.evaluar(x1); 
			fx1 = funcion.getResultadoFuncion();
			
			 i++;
		}
		mostrasTabla();
		return xMas1;
	}
	
	private static double regulaFalsiModificada(Funcion funcion, double a, double b, double epsilon) {
		int t = 9, i = 0; n = 0; m = 0;
			
		funcion.evaluar(a); 
		double  fa = funcion.getResultadoFuncion(), F = fa, w= fa;
		funcion.evaluar(b);
		double fb = funcion.getResultadoFuncion(), G = fb;
		/*if(fa * fb > 0) return 0;*/
		
		double c = (a*fb-b*fa)/(fb-fa);
		funcion.evaluar(c);
		double fc = funcion.getResultadoFuncion();
		
		matriz[n][m] = n;	m++;
		matriz[n][m] = a; 	m++;
		matriz[n][m] = b; 	m++;	
		matriz[n][m] = c; 	n++;
		
		while(Math.abs(fc)>epsilon && i<t) {
			if(fa * fc < 0) {
				b = c;
				G = fc;
				if(w * G > 0) F = F/2; 
			}
			else {
				a = c;
				F = fc;
				if(w * F > 0) G = G/2;
			}
			w = fc;
			
			funcion.evaluar(a); 
			fa = funcion.getResultadoFuncion();
						
			c = (a*G-b*F)/(G-F);
			funcion.evaluar(c);
			fc = funcion.getResultadoFuncion();
			
			m=0;	i++;
			matriz[n][m] = n;	m++;
			matriz[n][m] = a; 	m++;
			matriz[n][m] = b; 	m++;	
			matriz[n][m] = c; 	n++;
		}
		mostrasTabla();
		return c;
	}
	
	private static double regulaFalsi(Funcion funcion, double a, double b, double epsilon) {
		int t = 15, i = 0; n = 0; m = 0;
			
		funcion.evaluar(a); 
		double  fa = funcion.getResultadoFuncion();
		funcion.evaluar(b);
		double fb = funcion.getResultadoFuncion();
		/*if(fa * fb > 0) {
			return 0;
		}*/
		
		double c = (a*fb-b*fa)/(fb-fa);
		funcion.evaluar(c);
		double fc = funcion.getResultadoFuncion();
		
		matriz[n][m] = n;	m++;
		matriz[n][m] = a; 	m++;
		matriz[n][m] = b; 	m++;	
		matriz[n][m] = c; 	n++;
		
		while(Math.abs(fc)>epsilon && i<t) {
			if(fa * fc < 0) b = c;
			else a = c;
			
			funcion.evaluar(a); 
			fa = funcion.getResultadoFuncion();
			funcion.evaluar(b);
			fb = funcion.getResultadoFuncion();
			
			c = (a*fb-b*fa)/(fb-fa);
			funcion.evaluar(c);
			fc = funcion.getResultadoFuncion();
			i++;
			m=0;
			
			matriz[n][m] = n;	m++;
			matriz[n][m] = a; 	m++;
			matriz[n][m] = b; 	m++;	
			matriz[n][m] = c; 	n++;
		}
		mostrasTabla();
		return c;
	}

	private static double biseccion(Funcion funcion, double a, double b, double epsilon) {
		int t = 14, i = 0; n = 0; m = 0;
			
		funcion.evaluar(a); 
		double  fa = funcion.getResultadoFuncion();
		/*if(fa * fb > 0) return 0;*/
		
		double c = (a+b)/2;
		funcion.evaluar(c);
		double fc = funcion.getResultadoFuncion();
		
		matriz[n][m] = n;	m++;
		matriz[n][m] = a; 	m++;
		matriz[n][m] = b; 	m++;	
		matriz[n][m] = c; 	n++;
		
		while(Math.abs(fc)>epsilon && i<t) {
			if(fa * fc < 0) b = c;
			else a = c;
			
			funcion.evaluar(a); 
			fa = funcion.getResultadoFuncion();
			
			c = (a+b)/2;
			funcion.evaluar(c);
			fc = funcion.getResultadoFuncion();
			
			i++;			m=0;
			
			matriz[n][m] = n;	m++;
			matriz[n][m] = a; 	m++;
			matriz[n][m] = b; 	m++;	
			matriz[n][m] = c; 	n++;
		}
		
		mostrasTabla();
		return c;
	}

	private static void mostrasTabla() {
		int f=0,c;
		System.out.println("\tn\t[a\tb]\tm");
		for(f=0; f<n ; f++) {
			System.out.println("");
			for(c=0; c<=m ;c++) {
				System.out.print("\t"+matriz[f][c]);
			}
		}
		System.out.println("");
	}

}

