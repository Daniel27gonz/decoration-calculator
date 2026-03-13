import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Download, Eye, Upload, X, Image, Info, Save } from "lucide-react";
import QuoteTemplatePreview from "@/components/design/QuoteTemplatePreview";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuote } from "@/contexts/QuoteContext";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

interface AdditionalService {
  id: string;
  description: string;
  price: number;
}

export interface QuoteTemplateData {
  businessName: string;
  businessLogo: string;
  quoteDate: string;
  clientName: string;
  clientPhone: string;
  eventDate: string;
  eventLocation: string;
  decorationType: string;
  items: QuoteItem[];
  additionalServices: AdditionalService[];
  depositPercentage: number;
  depositMessage: string;
  thankYouMessage: string;
  customNote: string;
}

const Design = () => {
  const { user, profile } = useAuth();
  const { quotes, calculateCosts } = useQuote();
  const [showPreview, setShowPreview] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>("");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [templateData, setTemplateData] = useState<QuoteTemplateData>({
    businessName: "",
    businessLogo: "",
    quoteDate: "",
    clientName: "",
    clientPhone: "",
    eventDate: "",
    eventLocation: "",
    decorationType: "",
    items: [
      { id: "1", description: "", quantity: 1, price: 0 },
    ],
    additionalServices: [],
    depositPercentage: 50,
    depositMessage: "",
    thankYouMessage: "",
    customNote: "",
  });

  // Profile data is no longer auto-loaded - user fills everything manually

  // Save design config to profile
  const saveDesignConfig = async () => {
    if (!user) return;
    
    setIsSavingConfig(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          design_deposit_percentage: templateData.depositPercentage,
          design_deposit_message: templateData.depositMessage,
          design_additional_notes: templateData.customNote,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Configuración guardada",
        description: "Tus preferencias de diseño se han guardado correctamente",
      });
    } catch (error) {
      console.error("Error saving design config:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive",
      });
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Track last loaded quote to prevent duplicate notifications
  const lastLoadedQuoteIdRef = useRef<string | null>(null);

  // Load selected quote data into template
  useEffect(() => {
    if (selectedQuoteId && selectedQuoteId !== lastLoadedQuoteIdRef.current) {
      const selectedQuote = quotes.find(q => q.id === selectedQuoteId);
      if (selectedQuote) {
        lastLoadedQuoteIdRef.current = selectedQuoteId;
        
        // Format event date
        let formattedEventDate = "";
        if (selectedQuote.eventDate) {
          try {
            formattedEventDate = format(new Date(selectedQuote.eventDate), "d 'de' MMMM 'de' yyyy", { locale: es });
          } catch {
            formattedEventDate = selectedQuote.eventDate;
          }
        }

        // Calculate final price from the quote
        const costs = calculateCosts(selectedQuote);
        const finalPrice = costs.finalPrice;

        // Create a single service item with the event type and final price
        const serviceDescription = selectedQuote.eventType 
          ? `Servicio de decoración - ${selectedQuote.eventType}`
          : "Servicio de decoración con globos";

        const items: QuoteItem[] = [
          {
            id: "service-1",
            description: serviceDescription,
            quantity: 1,
            price: finalPrice,
          }
        ];

        setTemplateData(prev => ({
          ...prev,
          clientName: selectedQuote.clientName,
          clientPhone: selectedQuote.clientPhone || "",
          eventDate: formattedEventDate,
          decorationType: selectedQuote.eventType || "",
          items,
          additionalServices: [],
        }));

        toast({
          title: "Datos cargados",
          description: `Se cargaron los datos de la cotización de ${selectedQuote.clientName}`,
        });
      }
    }
  }, [selectedQuoteId, quotes]);

  const updateField = <K extends keyof QuoteTemplateData>(
    field: K,
    value: QuoteTemplateData[K]
  ) => {
    setTemplateData((prev) => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      price: 0,
    };
    updateField("items", [...templateData.items, newItem]);
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: string | number) => {
    updateField(
      "items",
      templateData.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeItem = (id: string) => {
    if (templateData.items.length > 1) {
      updateField(
        "items",
        templateData.items.filter((item) => item.id !== id)
      );
    }
  };

  const addService = () => {
    const newService: AdditionalService = {
      id: Date.now().toString(),
      description: "",
      price: 0,
    };
    updateField("additionalServices", [...templateData.additionalServices, newService]);
  };

  const updateService = (id: string, field: keyof AdditionalService, value: string | number) => {
    updateField(
      "additionalServices",
      templateData.additionalServices.map((service) =>
        service.id === id ? { ...service, [field]: value } : service
      )
    );
  };

  const removeService = (id: string) => {
    updateField(
      "additionalServices",
      templateData.additionalServices.filter((service) => service.id !== id)
    );
  };

  const calculateTotal = () => {
    const itemsTotal = templateData.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const servicesTotal = templateData.additionalServices.reduce(
      (sum, service) => sum + service.price,
      0
    );
    return itemsTotal + servicesTotal;
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "Archivo muy grande",
        description: "El logo debe ser menor a 5MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Formato no válido",
        description: "Por favor sube una imagen (JPG, PNG, GIF, WebP)",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para subir un logo",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingLogo(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/logo.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("business-logos")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("business-logos")
        .getPublicUrl(fileName);

      updateField("businessLogo", publicUrl);

      toast({
        title: "Logo subido",
        description: "Tu logo se ha guardado correctamente",
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Error al subir",
        description: "No se pudo subir el logo. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingLogo(false);
      // Reset input
      if (logoInputRef.current) {
        logoInputRef.current.value = "";
      }
    }
  };

  const handleRemoveLogo = async () => {
    if (!user) return;

    try {
      // List all files in user's folder and delete them
      const { data: files } = await supabase.storage
        .from("business-logos")
        .list(user.id);

      if (files && files.length > 0) {
        const filesToDelete = files.map((f) => `${user.id}/${f.name}`);
        await supabase.storage.from("business-logos").remove(filesToDelete);
      }

      updateField("businessLogo", "");

      toast({
        title: "Logo eliminado",
        description: "El logo ha sido eliminado",
      });
    } catch (error) {
      console.error("Error removing logo:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el logo",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
    </div>
  );
};

export default Design;
